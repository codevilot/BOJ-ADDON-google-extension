import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { path } from "./utils/path";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";

const problemId = path.problemId();
const root = document.querySelector(".container.content > .row > .col-md-12:nth-of-type(2)");
const ideDiv = document.createElement("div");
ideDiv.classList.add("boj-addon-root")
root && root.appendChild(ideDiv);

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
