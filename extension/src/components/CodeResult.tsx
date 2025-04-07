import { Dispatch, SetStateAction, useState } from "react";
import "./CodeResult.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { editorState, langState, serverStatusState }  from "../utils/atom";
import { path } from "../utils/path";
import { Result, SupportedLang } from "../types/types";
import { CodeResultBlock } from "./CodeResultBlock";


interface CodeResultProps{
    results: Result[],
    resizeY: string,
    clickEvent: () => void,
    dragEvent:Dispatch<SetStateAction<string>>
}
export const CodeResult = ({ clickEvent, dragEvent, resizeY, results }:CodeResultProps) => {
  const [resultY, setResultY] = useState(resizeY);
  const isConnected = useRecoilValue(serverStatusState);

  const disableRunCode = !path.getIsProblemPage() && !isConnected
  const resizeCodeWidth = ({ clientX }:React.DragEvent) => {
    if (clientX !== 0) {
      document.documentElement.style.setProperty(
        "--code-window-width",
        `${(clientX / window.innerWidth) * 100}`
      );
    }
  };
  const resizeResultHeight =({clientY} :React.DragEvent) =>{
    if (clientY !== 0) {
      dragEvent(`${clientY}px`);
      setResultY(`calc( 100vh - ${clientY}px )`);
    }
  }
  return (
    <div style={{ height: resultY }}>
      <div id="resize-vertical" onDrag={resizeCodeWidth}></div>
      <div
        id="resize-horizontal"
        onDrag={resizeResultHeight}
      >{!isConnected&&<div className="introd">npx boj-server를 터미널에 입력해주세요.</div>}</div>
      <div className="run-navigation">
        <span>실행결과 </span>
        <div className="code_nav">
          <SubmitButton/>
          <button onClick={clickEvent} className="code_button" disabled={disableRunCode}>
            실행(ALT(⌘)+ENTER)
          </button>
        </div>
      </div>
      <CodeResultBlock results={results} />
    </div>
  );
};

function SubmitButton() {
  const match = window.location.pathname.match(/\/submit\/(\d+)/);
  const problemId = path.problemId();
  const isSubmitPage = path.getIsSubmitPage()
  const [lang] = useRecoilState(langState);
  const editor = useRecoilValue(editorState);

  const getLangCode = (lang:SupportedLang) => {
    if (lang === 'cpp') return 84;
    if (lang === 'python') return 28;
    if (lang === 'nodejs') return 17;
    if (lang === 'rust') return 94;
    if (lang === 'java') return 93;
    return 84;
  };
  function getValidCsrfKey() {
    const inputs = document.querySelectorAll('input[name="csrf_key"]');
    const validInput = Array.from(inputs).find((input): input is HTMLInputElement =>
      input instanceof HTMLInputElement && input.value !== ""
    );
    return validInput?.value || null;
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.target as HTMLFormElement;
    if(editor)form.source.value = editor.getValue();
    form.language.value = getLangCode(lang);
  };
  if(!isSubmitPage) return null;
  return (
    <form
      id="code_submit_form"
      action=""
      method="POST"
      onSubmit={handleSubmit}
    >
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