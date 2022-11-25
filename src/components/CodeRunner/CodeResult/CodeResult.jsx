import { useState } from "react";
import { ResultBlock } from "./ResultBlock/ResultBlock.jsx";
import "./CodeResult.css";
export const CodeResult = ({ clickEvent, dragEvent, resizeY, results }) => {
  const [print, setPrint] = useState([]);
  const [resultY, setResultY] = useState(resizeY);

  const resizeCodeWidth = ({ clientX }) => {
    if (clientX !== 0) {
      document.documentElement.style.setProperty(
        "--code-window-width",
        `${(clientX / window.innerWidth) * 100}`
      );
    }
  };

  // useEffect(() => {
  //   console.log("set Engine on message");
  //   Engine.get.onmessage = (e) => {
  //     const json = IsJSONString(e.data);
  //     if (!json || json.input) return;
  //     const msgId = json.pop();
  //     setPrint([...json]);
  //     clearTimeout(msgId);
  //   };
  // }, [Engine.reset]);

  return (
    <div style={{ height: resultY }}>
      <div id="resize-vertical" draggable="true" onDrag={resizeCodeWidth}></div>
      <div
        id="resize-horizontal"
        draggable="true"
        onDrag={({ clientY }) => {
          if (clientY !== 0) {
            dragEvent(clientY);
            setResultY(`calc( 100vh - ${clientY}px )`);
          }
        }}
      ></div>
      <div className="run-navigation">
        <span>실행결과</span>
        <span className="running-status close">실행 중</span>

        <button onClick={clickEvent} className="run_code">
          실행(ALT(⌘)+ENTER)
        </button>
      </div>
      <div className="run-result-list">
        {results.map(({ input, output, result }, index) => (
          <ResultBlock
            input={input}
            output={output}
            result={result}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
