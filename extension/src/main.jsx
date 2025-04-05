import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { CodeRunner } from "./components/CodeRunner/CodeRunner";
import { RecoilRoot, useRecoilState } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BOJProblem } from "./components/Problem/Problem";
import TestCasePortal from "./components/TestCase/TestCase";
import { path } from "./utils/path.js";
import { editorModeState } from "./utils/atom";

const problemId = path.problemId();
const isLogin = path.getIsLogin();
if (problemId && window.location.pathname.startsWith("/problem/") && isLogin) {
  window.location.replace(`/submit/${problemId}`);
} else {
  const root = document.querySelector(".container.content > .row > .col-md-12:nth-of-type(2)");
  const ideDiv = document.createElement("div");
  ideDiv.classList.add("boj-addon-root")
  root.appendChild(ideDiv);

  const queryClient = new QueryClient();
  const reactRoot = createRoot(ideDiv);

  reactRoot.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <App problemId={problemId} />
        </RecoilRoot>
      </QueryClientProvider>
    </StrictMode>
  );
}

function App({ problemId }) {
  const [editorMode, setEditorMode] = useRecoilState(editorModeState);
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
    if(legend) legend.innerText="에디터 변경";
    const handleClick = () => {
      const updatedMode = !editorMode
      setEditorMode(updatedMode)
      localStorage.setItem('editor-mode', updatedMode);
    };

    if (legend) legend.addEventListener('click', handleClick);
  

    return () => {if (legend)legend.removeEventListener('click', handleClick)};
  }, []);

  useEffect(()=>{
    editorMode?  document.getElementById("code-runner").classList.add('displayNone') : document.getElementById("code-runner").classList.remove('displayNone')
  },[editorMode])
  return (
    <>
      {problemId ? <BOJProblem problemId={problemId} /> : <TestCasePortal />}
      <CodeRunner />
    </>
  );
}
