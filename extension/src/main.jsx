import { StrictMode } from "react";
import { render } from "react-dom";
import { CodeRunner } from "./components/CodeRunner/CodeRunner";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TestCase from "./components/TestCase/TestCase";

const sampleRoot = document.createElement("div");
const queryClient = new QueryClient();
document
  .getElementById("hint")
  .insertAdjacentElement("beforebegin", sampleRoot);

render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <TestCase />
        <CodeRunner />
      </RecoilRoot>
    </QueryClientProvider>
  </StrictMode>,

  sampleRoot
);
