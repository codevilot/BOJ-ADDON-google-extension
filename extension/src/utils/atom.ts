import { atom } from "recoil";
import type { editor } from "monaco-editor";
import { SupportedLang, TestCode } from "../types/types";


const exampleNumberState = atom({
  key: "exampleNumberState",
  default: document.querySelectorAll(`[id*="sample-input-"]`).length,
});

const testCodeState = atom<TestCode[]>({
  key: "testCodeState",
  default: [],
});

const editorState = atom<editor.IStandaloneCodeEditor | null>({
  key: "editorState",
  default: null,
});

const editorModeState = atom({
  key: "editorModeState",
  default: document.querySelector(".loginbar.pull-right")?.textContent?.includes("로그아웃")
    ?(localStorage.getItem('editor-mode')|| true)==='true'
    : false,
});


const langState = atom<SupportedLang>({
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
export { editorState, testCodeState, exampleNumberState, langState, serverStatusState, supportedLangState, editorModeState };
