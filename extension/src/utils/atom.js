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

const langState = atom({
  key:'langState',
  default:'nodejs'
})

const serverStatusState = atom({
  key:'serverStatusState',
  default: false
})

const supportedLangState = atom({
  key:'supportedLangState',
  default:[]
})
export { editorState, testCodeState, exampleNumberState, langState, serverStatusState, supportedLangState };
