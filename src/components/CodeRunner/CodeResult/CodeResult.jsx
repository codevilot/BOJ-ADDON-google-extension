import { useEffect, useState } from "react";
import { ResultBlock } from "./ResultBlock/ResultBlock.jsx";
import { IsJSONString } from "../../../utils/IsJSONString.jsx";
import "./CodeResult.css";
export const CodeResult = ({ clickEvent }) => {
  const [print, setPrint] = useState([]);

  useEffect(() => {
    window.addEventListener("message", (e) => {
      const json = IsJSONString(e.data);
      if (!json || json.input) return;
      setPrint([...json]);
    });
  }, []);
  return (
    <>
      <div className="run-navigation">
        <span>실행결과</span>
        <span className="running-status close">실행 중</span>
        <button onClick={clickEvent} className="run_code">
          실행(ALT(⌘)+ENTER)
        </button>
      </div>
      <div className="run-result-list">
        {print.length < 1
          ? null
          : print.map(({ input, output, result }, index) => (
              <ResultBlock
                input={input}
                output={output}
                result={result}
                index={index}
              />
            ))}
      </div>
    </>
  );
};
