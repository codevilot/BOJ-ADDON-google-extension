import { StrictMode } from "react";
import { render } from "react-dom";
import { CodeRunner } from "./components/CodeRunner/CodeRunner";
import { RecoilRoot } from "recoil";
import TestCase from "./components/TestCase/TestCase";

const sampleRoot = document.createElement("div");
document
  .getElementById("hint")
  .insertAdjacentElement("beforebegin", sampleRoot);

render(
  <StrictMode>
    <RecoilRoot>
      <TestCase />
      <CodeRunner />
    </RecoilRoot>
  </StrictMode>,

  sampleRoot
);
