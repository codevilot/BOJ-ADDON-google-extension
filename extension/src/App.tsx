import { useEffect } from "react";
import {  useRecoilState, useRecoilValue } from "recoil";
import { CodeRunner } from "./components/CodeRunner";
import { editorModeState, serverStatusState } from "./utils/atom";
import TestCase from "./components/TestCase";
import { BOJProblem } from "./components/BOJProblem";
import { path } from "./utils/path";

interface AppProps{
  problemId : string | null;
}
export function App({ problemId }:AppProps) {
  const isConnected = useRecoilValue(serverStatusState);
  const [editorMode, setEditorMode] = useRecoilState(editorModeState);
  if(path.getIsLogin() && path.getIsProblemPage() &&isConnected)
    window.location.replace(`/submit/${problemId}`);

  useEffect(() => {
    const firstMenuItem = document.querySelector("ul.problem-menu > li:first-child a");
    if (firstMenuItem) {
      const parentLi = firstMenuItem.closest("li");
      if (parentLi) parentLi.classList.add("active");
      firstMenuItem.addEventListener("click", (e) => e.preventDefault());
    }
  }, []);
  useEffect(() => {
    const legend = document.querySelector('#submit_form legend');
    if(legend) legend.textContent="에디터 변경";
    const handleClick = () => {
      const updatedMode = !editorMode
      setEditorMode(updatedMode)
      localStorage.setItem('editor-mode', `${updatedMode}`);
    };

    if (legend) legend.addEventListener('click', handleClick);
  

    return () => {if (legend)legend.removeEventListener('click', handleClick)};
  }, []);

  useEffect(()=>{
    editorMode?  document.getElementById("code-runner")?.classList.add('displayNone') : document.getElementById("code-runner")?.classList.remove('displayNone')
  },[editorMode])
  return (
    <>
      {problemId ? <BOJProblem problemId={problemId} /> : <TestCase />}
      <CodeRunner />
    </>
  );
}