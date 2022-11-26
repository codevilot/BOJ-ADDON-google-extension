import "./ResultBlock.css";

export const ResultBlock = ({ results }) => {
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
  // const isCorrect =
  //   output
  //     ?.split("\n")
  //     ?.map((item) => item.trim())
  //     .filter((item) => item !== "")
  //     .join("\n") ===
  //   result
  //     ?.split("\n")
  //     ?.map((item) => item.trim())
  //     .filter((item) => item !== "")
  //     .join("\n");
  return (
    <div className="run-result-list">
      {results.map(({ input, output, result, message, error }, index) =>
        message ? (
          <div className={"wrong"}>
            <div>{message}</div>
          </div>
        ) : error ? (
          <div className={"wrong"}>
            <div>{error}</div>
          </div>
        ) : (
          <div>
            {/* <div className={isCorrect ? "correct" : "wrong"}> */}
            <div>예제 {index + 1}</div>
            <div>입력 값 : {input}</div>
            <div>입력 결과 : {result}</div>
            <div>출력 결과 : {output}</div>
          </div>
        )
      )}
    </div>
  );
};
// export const ResultBlock = ({
//   message,
//   input,
//   output,
//   result,
//   index,
//   error,
// }) => {
//   const isCorrect =
//     output
//       ?.split("\n")
//       ?.map((item) => item.trim())
//       .filter((item) => item !== "")
//       .join("\n") ===
//     result
//       ?.split("\n")
//       ?.map((item) => item.trim())
//       .filter((item) => item !== "")
//       .join("\n");
//   return message ? (
//     <div className={"wrong"}>
//       <div>{message}</div>
//     </div>
//   ) : error ? (
//     <div className={"wrong"}>
//       <div>{error}</div>
//     </div>
//   ) : (
//     <div className={isCorrect ? "correct" : "wrong"}>
//       <div>예제 {index + 1}</div>
//       <div>입력 값 : {input}</div>
//       <div>입력 결과 : {result}</div>
//       <div>출력 결과 : {output}</div>
//     </div>
//   );
// };
