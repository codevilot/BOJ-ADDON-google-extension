import "./ResultBlock.css";
export const ResultBlock = ({ input, output, result, index }) => {
  const isCorrect =
    output
      .split("\n")
      ?.map((item) => item.trim())
      .filter((item) => item !== "")
      .join("\n") ===
    result
      .split("\n")
      ?.map((item) => item.trim())
      .filter((item) => item !== "")
      .join("\n");
  return (
    <>
      <div className={isCorrect ? "correct" : "wrong"}>
        <div>예제 {index + 1}</div>
        <div>입력 값 : {input}</div>
        <div>입력 결과 : {result}</div>
        <div>출력 결과 : {output}</div>
      </div>
    </>
  );
};
