export const Message = (code, msgId) => {
  const msgInfo = {
    input: [],
    output: [],
    code,
    msgId,
  };
  msgInfo.input = [...document.querySelectorAll(`[id*="sample-input-"]`)].map(
    (input) => input.value ?? input.textContent
  );
  msgInfo.output = [...document.querySelectorAll(`[id*="sample-output-"]`)].map(
    (output) => output.value ?? output.textContent
  );
  return msgInfo;
};
