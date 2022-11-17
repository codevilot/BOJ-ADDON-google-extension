export const Message = (code) => {
  const msgInfo = {
    input: [],
    output: [],
    code,
  };
  [...document.querySelectorAll(`[id*="sample-input-"]`)]?.forEach(
    ({ textContent }) => msgInfo.input.push(textContent)
  );
  [...document.querySelectorAll(`[id*="sample-output-"]`)]?.forEach(
    ({ textContent }) => msgInfo.output.push(textContent)
  );
  return msgInfo;
};
