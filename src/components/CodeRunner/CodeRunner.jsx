import { useRef, useEffect, useContext, useState } from "react";
import * as monaco from "monaco-editor";
import "./CodeRunner.css";
import { InputMenu } from "./InputMenu/InputMenu.jsx";
import { CodeResult } from "./CodeResult/CodeResult.jsx";
import { BojAddonContextStore } from "../../utils/store.jsx";
import { Message } from "../../utils/Message.jsx";
import { Engine } from "../../utils/Engine.jsx";
import { setTheme } from "../../utils/Theme.jsx";
window.MonacoEnvironment = {
  getWorkerUrl: function (_workerId, _label) {
    return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
      self.MonacoEnvironment = {
        baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/'
      };
      importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs/base/worker/workerMain.js');`)}`;
  },
};
export const CodeRunner = () => {
  const { editor, setEditor } = useContext(BojAddonContextStore);
  const [resizeY, setResizeY] = useState("80vh");
  const editorElement = useRef(null);
  const savedCode = localStorage.getItem(window.location.pathname) ?? "";

  const sendToEngine = () => {
    Engine.contentWindow.postMessage(
      JSON.stringify(Message(editor.getValue())),
      "*"
    );
  };

  const handleKey = ({ altKey, key }) => {
    if (altKey && key === "Enter") {
      sendToEngine();
    }
  };

  const handleUnload = () =>
    localStorage.setItem(window.location.pathname, editor.getValue());

  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [editor]);

  useEffect(() => {
    if (editorElement.current) {
      setEditor(
        monaco.editor.create(editorElement.current, {
          value: savedCode,
          language: "javascript",
          theme: setTheme(),
          fontSize: "18px",
          minimap: false,
          automaticLayout: true,
        })
      );
    }

    return () => editor.dispose();
  }, [editorElement]);

  return (
    <>
      <div id="code-runner" onKeyDown={handleKey}>
        <div style={{ height: resizeY }}>
          <InputMenu />
          <div id="Editor" ref={editorElement}></div>
        </div>
        <CodeResult
          clickEvent={sendToEngine}
          dragEvent={setResizeY}
          resizeY={`calc(100vh - ${resizeY})`}
        />
      </div>
    </>
  );
};
