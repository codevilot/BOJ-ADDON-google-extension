import { languages } from "monaco-editor";

export const Message = (code, lang) => {
  const msgInfo = {
    input: [],
    expected: [],
    code:code,
    language:lang
    // msgId,
  };
  msgInfo.input = [...document.querySelectorAll(`[id*="sample-input-"]`)].map(
    (input) => input.value ?? input.textContent
  );
  msgInfo.expected = [...document.querySelectorAll(`[id*="sample-output-"]`)].map(
    (expected) => expected.value ?? expected.textContent
  );
  return msgInfo;
};
