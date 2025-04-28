import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./CodeResult.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { editorState, langState, serverStatusState }  from "../utils/atom";
import { path } from "../utils/path";
import { Result, SupportedLang } from "../types/types";
import { CodeResultBlock } from "./CodeResultBlock";
import { bojStorage } from "../utils/bojStorage";
import { getLangCode } from "../utils/lang";
import { removeSpace } from "../utils/format";


interface CodeResultProps{
    results: Result[],
    resizeY: string,
    clickEvent: () => void,
    dragEvent:Dispatch<SetStateAction<string>>
}
export const CodeResult = ({ clickEvent, dragEvent, resizeY, results }:CodeResultProps) => {
  const [resultY, setResultY] = useState(resizeY);
  const [isDraggingX, setIsDraggingX] = useState(false)
  const [isDraggingY, setIsDraggingY] = useState(false)
  const isConnected = useRecoilValue(serverStatusState);
  const passedCount = results.reduce(
    (acc, cur) =>
      acc + (removeSpace(cur.output || '') === removeSpace(cur.expected || '') ? 1 : 0),
    0
  );
  const resultCount = results.length;
  const disableRunCode = !path.getIsProblemPage() && !isConnected


  const handleYMouseDown = () =>setIsDraggingY(true)
  const handleYMouseUp = () => setIsDraggingY(false)
  const handleYMouseMove = ({clientY} :MouseEvent) =>{
    if(!isDraggingY) return
    if (clientY !== 0) {
      dragEvent(`${clientY}px`);
      setResultY(`calc( 100vh - ${clientY}px )`);
    }
  }

  const handleXMouseDown = () =>setIsDraggingX(true)
  const handleXMouseUp = () => setIsDraggingX(false)
  const handleXMouseMove = ({clientX} :MouseEvent) =>{
    if(!isDraggingX) return
    if (clientX !== 0) {
      document.documentElement.style.setProperty(
        "--code-window-width",
        `${((clientX+10) / window.innerWidth) * 100}`
      );
    }
  }

  useEffect(()=>{
    document.addEventListener("mouseup", handleXMouseUp)
    document.addEventListener("mousemove", handleXMouseMove)
    return () =>  {
      document.removeEventListener("mouseup", handleXMouseUp)
      document.removeEventListener("mousemove", handleXMouseMove)
    }
  },[isDraggingX])

  useEffect(()=>{
    document.addEventListener("mouseup", handleYMouseUp)
    document.addEventListener("mousemove", handleYMouseMove)
    return () =>  {
      document.removeEventListener("mouseup", handleYMouseUp)
      document.removeEventListener("mousemove", handleYMouseMove)
    }
  },[isDraggingY])
  return (
    <div style={{ height: resultY }}>
      <div id="resize-vertical" onMouseDown={handleXMouseDown}></div>
      <div id="resize-horizontal" onMouseDown={handleYMouseDown}
      >{!isConnected&&<div className="introd">npx boj-server를 터미널에 입력해주세요.</div>}</div>
      <div className="run-navigation">
        <span>실행결과 {
        resultCount>0 && !results?.[0]?.message &&
        <span className={resultCount===passedCount ? "correct" : "wrong"}>{resultCount}개 중 {passedCount}개 정답</span>}</span>
        <div className="code_nav">
          <SubmitButton/>
          <button onClick={clickEvent} className="code_button" disabled={disableRunCode}>
            실행(ALT(⌥)+ENTER)
          </button>
        </div>
      </div>
      <CodeResultBlock results={results} />
    </div>
  );
};

function SubmitButton() {
  const problemId = path.problemId();
  const isSubmitPage = path.getIsSubmitPage()
  const [lang] = useRecoilState(langState);
  const editor = useRecoilValue(editorState);


  function getValidCsrfKey() {
    const inputs = document.querySelectorAll('input[name="csrf_key"]');
    const validInput = Array.from(inputs).find((input): input is HTMLInputElement =>
      input instanceof HTMLInputElement && input.value !== ""
    );
    return validInput?.value || null;
  }
  function getGRecaptchaResponse(){
    const wrapper = document.getElementById("g-recaptcha-response-100000") as HTMLTextAreaElement;
    return wrapper?.value || null;
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.target as HTMLFormElement;
    form["g-recaptcha-response"].value = getGRecaptchaResponse();
    if(editor)form.source.value = editor.getValue();
    form.language.value = bojStorage.isValidPage()
                            ? getLangCode(lang) 
                            : (document.querySelector("select#language") as HTMLSelectElement).value;
  };
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'http://localhost:100/enterprise.js';
    script.async = true;
    document.body.appendChild(script);

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  if(!isSubmitPage) return null;
  return (
    <form
      id="code_submit_form"
      action=""
      method="POST"
      onSubmit={handleSubmit}
    >                      
      <input type="hidden" name="g-recaptcha-response" value={getGRecaptchaResponse()||""} />
      <input type="hidden" name="problem_id" value={problemId||""} />
      <input type="hidden" name="language" value="" />
      <input type="hidden" name="code_open" value="open" />
      <input type="hidden" name="source" value="" />
      <input
        type="hidden"
        name="csrf_key"
        value={getValidCsrfKey()||""}
      />

        <button type="submit" className="code_submit_button">
          제출
        </button>
    </form>
  );
}