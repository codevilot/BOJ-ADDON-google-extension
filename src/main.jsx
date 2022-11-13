import { StrictMode } from "react";
import { render } from "react-dom";
import { CodeRunner } from "./components/CodeRunner/CodeRunner.jsx";
import { BojAddonContext } from "./utils/store.jsx";
import TestCase from "./components/TestCase/TestCase.jsx";
const sampleRoot = document.createElement("div");
document
  .getElementById("hint")
  .insertAdjacentElement("beforebegin", sampleRoot);

render(
  <StrictMode>
    <BojAddonContext>
      <TestCase />

      <CodeRunner />
    </BojAddonContext>
  </StrictMode>,
  sampleRoot
);
