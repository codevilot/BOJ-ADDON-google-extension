import { useRef, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import * as monaco from "monaco-editor";
import "./CodeRunner.css";
import { InputMenu } from "./InputMenu/InputMenu.jsx";
import { CodeResult } from "./CodeResult/CodeResult.jsx";

import { IsJSONString } from "../../utils/IsJSONString";
import { Message } from "../../utils/Message";
import { Engine } from "../../utils/Engine";
import { setTheme } from "../../utils/Theme";
import { editorState, langState, serverStatusState } from "../../utils/atom";
import { bojApi } from "../../api/BOJApi.js";
import { path } from "../../utils/path.js";
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
  const [results, setResults] = useState([]);
  const [isConnected] = useRecoilState(serverStatusState);
  const [lang] = useRecoilState(langState)
  const resultsRef = useRef([]);
  const editorElement = useRef(null);
  const savedCode = localStorage.getItem(path.getProblemPathByNumber()) ?? "";
  const codeRun = () => {
    if(isConnected) sendToCodeRunServer()
    else sendToEngine()
  }
  const updateResults = (array) => {
    resultsRef.current = array;
    setResults(resultsRef.current);
  };
  const setEvent = () => {
    Engine.get.onmessage = (e) => {
      const json = IsJSONString(e.data);
      if (!json || json.input) return;
      const msgId = json.pop();
      updateResults([...json]);
      clearTimeout(msgId);
    };
  };
  const sendToCodeRunServer = async () => {
    updateResults([{ message: "실행중" }]);

    const data = JSON.stringify(Message(editor.getValue().replaceAll("\\\\","\\"), lang))
    try{
      const codeResult = await bojApi.run(data)
      updateResults(codeResult?.results||[])
    }catch(err){
      updateResults(JSON.parse(err.message))
    }
};
  const sendToEngine = () => {
    updateResults([{ message: "실행중" }]);
    const msgId = setTimeout(() => {
      if (!resultsRef.current[0]?.error) {
        Engine.reset();
        updateResults([{ error: "시간 초과" }]);
        setEvent();
      }
    }, 3000);
    Engine.get.postMessage(JSON.stringify(Message(editor.getValue(), msgId)));
    return () => {
      clearTimeout(msgId);
    };
  };

  const handleKey = ({ altKey, key }) => {
    if (altKey && key === "Enter") codeRun();
  };

  const handleUnload = () =>
    localStorage.setItem(path.getProblemPathByNumber(), editor.getValue());

  const errorHandler = ({ message }) => updateResults([{ error: message }]);

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
          fontSize: "18px",
          minimap: false,
          fontLigatures: false,
          automaticLayout: true,
        })
      );
    }

    return () => editor.dispose();
  }, [editorElement]);
  useEffect(() => {
    const monacoLang = lang === "nodejs" ? "javascript" : lang;
    if (editor) monaco.editor.setModelLanguage(editor.getModel(), monacoLang); 
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
