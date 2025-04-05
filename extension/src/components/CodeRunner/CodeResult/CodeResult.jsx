import { useState } from "react";
import { ResultBlock } from "./ResultBlock/ResultBlock.jsx";
import {path} from "../../../utils/path.js"
import "./CodeResult.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { editorState, langState, serverStatusState } from "../../../utils/atom.js";



export const CodeResult = ({ clickEvent, dragEvent, resizeY, results }) => {
  const [resultY, setResultY] = useState(resizeY);
  const isConnected = useRecoilValue(serverStatusState);
  const resizeCodeWidth = ({ clientX }) => {
    if (clientX !== 0) {
      document.documentElement.style.setProperty(
        "--code-window-width",
        `${(clientX / window.innerWidth) * 100}`
      );
    }
  };
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
      >{!isConnected&&<div className="introd">npx boj-server를 터미널에 입력해주세요.</div>}</div>
      <div className="run-navigation">
        <span>실행결과 </span>
        <div className="code_nav">
          <SubmitButton/>
          <button onClick={clickEvent} className="code_button">
            실행(ALT(⌘)+ENTER)
          </button>
        </div>
      </div>
      <ResultBlock results={results} />
    </div>
  );
};

function SubmitButton() {
  const match = window.location.pathname.match(/\/submit\/(\d+)/);
  const problemId = path.problemId();
  const isSubmitPage = path.getIsSubmitPage()
  const [lang] = useRecoilState(langState);
  const editor = useRecoilValue(editorState);

  const getLangCode = (lang) => {
    if (lang === 'cpp') return 84;
    if (lang === 'python') return 28;
    if (lang === 'java') return 93;
    if (lang === 'nodejs') return 17;
    if (lang === 'rust') return 94;
    return 84;
  };
  function getValidCsrfKey() {
    const inputs = document.querySelectorAll('input[name="csrf_key"]');
    const validInput = Array.from(inputs).find(input => input.value !== '');
    return validInput?.value || null;
  }
  const handleSubmit = (e) => {
    const form = e.target;
    form.source.value = editor.getValue();
    form.language.value = getLangCode(lang);
  };
  if(!isSubmitPage) return null;
  return (
    <form
      id="code_submit_form"
      action
      method="POST"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="problem_id" value={problemId} />
      <input type="hidden" name="language" value="" />
      <input type="hidden" name="code_open" value="open" />
      <input type="hidden" name="source" value="" />
      <input
        type="hidden"
        name="csrf_key"
        value={getValidCsrfKey()}
      />

        <button type="submit" className="code_button">
          제출
        </button>
    </form>
  );
}