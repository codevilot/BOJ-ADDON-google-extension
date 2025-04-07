import { useRef, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import * as monaco from "monaco-editor";
import "./CodeRunner.css";
import { editorState, langState, serverStatusState } from "../utils/atom";
import { path } from "../utils/path";
import { formatMessage, isJSONString } from "../utils/format";
import { bojApi } from "../api/bojApi";
import { jsEngine } from "../utils/jsEngine";
import { setTheme } from "../utils/theme";
import { InputMenu } from "./InputMenu";
import { CodeResult } from "./CodeResult";
import { Result } from "../types/types";

window.MonacoEnvironment = { getWorkerUrl: () => proxy };
const proxy = URL.createObjectURL(
  new Blob(
    [
      `self.MonacoEnvironment = {baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'};
    importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');`,
    ],
    { type: "text/javascript" }
  )
);


export const CodeRunner = () => {
  const [editor, setEditor] = useRecoilState(editorState);
  const [resizeY, setResizeY] = useState("75vh");
  const [results, setResults] = useState<Result[]>([]);
  const [isConnected] = useRecoilState(serverStatusState);
  const [lang] = useRecoilState(langState)
  const resultsRef = useRef<Result[]>([]);
  const editorElement = useRef(null);
  const savedCode = localStorage.getItem(path.getProblemPathByNumber()) ?? "";
  const codeRun = () => {
    if(isConnected) sendToCodeRunServer()
    else sendToEngine()
  }
  const updateResults = (array:Result[]) => {
    resultsRef.current = array;
    setResults(resultsRef.current);
  };
  const setEvent = () => {
    if(!jsEngine.get) return
    jsEngine.get.onmessage = (e) => {
      const json = isJSONString(e.data);
      if (!json || json.input) return;
      const msgId = json.pop();
      updateResults([...json]);
      clearTimeout(msgId);
    };
  };
  const sendToCodeRunServer = async () => {
    updateResults([{ message: "실행중" }]);
    if(!editor) return
    const data = JSON.stringify(formatMessage(editor.getValue().replaceAll("\\\\","\\"), lang))
    try{
      const codeResult = await bojApi.run(data)
      updateResults(codeResult?.results||[])
    }catch(err){
        const errorMessage = (err as Error).message;
        updateResults(JSON.parse(errorMessage));
    }
};
  const sendToEngine = () => {
    updateResults([{ message: "실행중" }]);
    const msgId = setTimeout(() => {
      if (!resultsRef.current[0]?.error) {
        jsEngine.reset();
        updateResults([{ error: "시간 초과" }]);
        setEvent();
      }
    }, 3000);
    if(jsEngine.get && editor)
        jsEngine.get.postMessage(JSON.stringify(formatMessage(editor.getValue(), `${msgId}`)));
    return () => {
      clearTimeout(msgId);
    };
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if ((e.altKey || e.metaKey) && e.key === "Enter") codeRun();
  };

  const handleUnload = () =>
    editor && localStorage.setItem(path.getProblemPathByNumber(), editor.getValue());

  const errorHandler = (event: ErrorEvent) => {
    updateResults([{ error: event.message }]);
  };
  
  useEffect(() => {
    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [editor]);

  useEffect(() => {
    setEvent();
    if (editorElement.current) {
      setEditor(
        monaco.editor.create(editorElement.current, {
          value: savedCode,
          language: "javascript",
          theme: setTheme(),
          fontSize: 18,
          minimap: {enabled:false},
          fontLigatures: false,
          automaticLayout: true,
        })

      );

    }

    return () =>{editor && editor.dispose();}
  }, [editorElement]);
  useEffect(() => {
    const monacoLang = lang === "nodejs" ? "javascript" : lang;
    const model = editor?.getModel();
  
    if (model) {
      monaco.editor.setModelLanguage(model, monacoLang);
    }
  }, [lang]);

  return (
    <>
      <div id="code-runner" onKeyUp={handleKey}>
        <div style={{ height: resizeY }}>
          <InputMenu />
          <div id="Editor" ref={editorElement}></div>
        </div>
        <CodeResult
          clickEvent={codeRun}
          results={results}
          dragEvent={setResizeY}
          resizeY={`calc(100vh - ${resizeY})`}
        />
      </div>
    </>
  );
};
