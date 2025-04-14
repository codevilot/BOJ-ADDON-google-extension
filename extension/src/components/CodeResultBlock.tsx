import { Result } from "../types/types";
import { removeSpace } from "../utils/format";
import "./CodeResultBlock.css";

export const CodeResultBlock = ({ results }:{results : Result[]}) => {
  return (
    <div className="run-result-list">
      {results?.map(({ input, output, expected, message, error }:Result, index:number) =>{
        const isCorrect = removeSpace(output||'') === removeSpace(expected||'')
        return message ? (
          <div className="msg">
            <div>{message}</div>
          </div>
        ) : error ? (
          <div className="wrong">
            <div>{error}</div>
          </div>
        ) : (
            <div className={isCorrect ? "correct" : "wrong"}>
            <div>
                {isCorrect ? "✅ 정답" : "❌ 오답"} - 예제 {index + 1}
            </div>
            <div>
                <strong>입력 값:</strong>
                <pre>{input}</pre>
            </div>
            <div>
                <strong>입력 결과:</strong>
                <pre>{output}</pre>
            </div>
            <div>
                <strong>출력 결과:</strong>
                <pre>{expected}</pre>
            </div>
            </div>
        )}
      )}
    </div>
  );
};
