import { useState } from "react";
import { ResultBlock } from "./ResultBlock/ResultBlock.jsx";
import "./CodeResult.css";
export const CodeResult = ({ clickEvent, dragEvent, resizeY, results }) => {
  console.log(results, "CodeResult");
  const [resultY, setResultY] = useState(resizeY);

  const resizeCodeWidth = ({ clientX }) => {
    if (clientX !== 0) {
      document.documentElement.style.setProperty(
        "--code-window-width",
        `${(clientX / window.innerWidth) * 100}`
      );
    }
  };
  // const scoring = (results) => {
  //   return results.filter(
  //     ({ result, output }) =>
  //       output
  //         ?.split("\n")
  //         ?.map((item) => item.trim())
  //         .filter((item) => item !== "")
  //         .join("\n") ===
  //       result
  //         ?.split("\n")
  //         ?.map((item) => item.trim())
  //         .filter((item) => item !== "")
  //         .join("\n")
  //   ).length;
  // };
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
      <ResultBlock results={results} />
      {/* <div className="run-result-list"> */}
      {/* {scoring()} */}
      {/* {results.map(({ input, output, result, message, error }, index) => (
          <ResultBlock
            input={input}
            output={output}
            result={result}
            index={index}
            error={error}
            message={message}
          />
        ))} */}
      {/* </div> */}
    </div>
  );
};
