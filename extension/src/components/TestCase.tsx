import { useRecoilState, useRecoilValue } from "recoil";
import { createPortal } from 'react-dom';
import { Fragment, useEffect } from "react";
import { testCodeState, exampleNumberState } from "../utils/atom";

export default function TestCase() {
  const [testCode, setTestCode] = useRecoilState(testCodeState);
  const [exampleNumber, setExampleNumber] = useRecoilState(exampleNumberState);
  const hintElement =document.getElementById('hint')
  const handleClick = () => {
    setTestCode([
      ...testCode,
      {
        input: "입력을 입력해주세요",
        output: "출력을 입력해주세요",
      },
    ]);
  };
  useEffect(()=>{
    if(exampleNumber!==0) return;
    setExampleNumber(document.querySelectorAll(`[id*="sample-input-"]`).length);
  },[])
  

  return hintElement?.parentNode instanceof Element
    ? createPortal(
        <div className="row">
          {testCode.length < 1
            ? null
            : testCode.map(({ input, output }, index) => (
                <Fragment key={index}>
                  <TestCase.Input value={input} index={index + exampleNumber + 1} />
                  <TestCase.Output value={output} index={index + exampleNumber + 1} />
                </Fragment>
              ))}
          <button className="btn-add-sample" onClick={handleClick}>
            예제 추가하기
          </button>
        </div>,
        hintElement.parentNode 
      )
    : null;
}

interface TestCaseItemProps{
    value:string,
    index:number
}
TestCase.Input = function ({ value, index }:TestCaseItemProps) {
  return (
    <div className="col-md-6">
      <section id="sampleinput1">
        <div className="headline">
          <h2>예제 입력 {index}</h2>
        </div>
        <textarea className="sampledata" id={"sample-input-" + index}>
          {value}
        </textarea>
      </section>
    </div>
  );
};

TestCase.Output = function ({ value, index }:TestCaseItemProps) {
  return (
    <div className="col-md-6">
      <section id="sampleoutput1">
        <div className="headline">
          <h2>예제 출력 {index}</h2>
        </div>
        <textarea className="sampledata" id={"sample-output-" + index}>
          {value}
        </textarea>
      </section>
    </div>
  );
};
