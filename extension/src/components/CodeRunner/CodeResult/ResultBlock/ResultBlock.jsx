import "./ResultBlock.css";

export const ResultBlock = ({ results }) => {
  const removeSpace = (str) =>
    str
      ?.split("\n")
      ?.map((item) => item.trim())
      .filter((item) => item !== "")
      .join("\n");
  return (
    <div className="run-result-list">
      {results?.map(({ input, output, expected, message, error }, index) =>{
        const isCorrect = removeSpace(output) === removeSpace(expected)
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
            <div>예제 {index + 1} - {isCorrect? "정답" : "오답"}</div>
            <div>입력 값 : {input}</div>
            <div>입력 결과 : {output}</div>
            <div>출력 결과 : {expected}</div>
          </div>
        )}
      )}
    </div>
  );
};
