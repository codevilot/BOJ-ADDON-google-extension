import { atom } from "recoil";

const exampleNumberState = atom({
  key: "exampleNumberState",
  default: document.querySelectorAll(`[id*="sample-input-"]`).length,
});

const testCodeState = atom({
  key: "testCodeState",
  default: [],
});

const editorState = atom({
  key: "editorState",
  default: null,
});

export { editorState, testCodeState, exampleNumberState };
