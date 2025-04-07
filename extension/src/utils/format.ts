export const formatMessage = (code: string, lang: string) => {
  const msgInfo: {
    input: string[];
    expected: string[];
    code: string;
    language: string;
  } = {
    input: [],
    expected: [],
    code,
    language: lang
  };

  msgInfo.input = Array.from(document.querySelectorAll(`[id*="sample-input-"]`)).map(
    (input) => (input as HTMLInputElement).value ?? input.textContent ?? ""
  );
  
  msgInfo.expected = Array.from(document.querySelectorAll(`[id*="sample-output-"]`)).map(
    (expected) => (expected as HTMLInputElement).value ?? expected.textContent ?? ""
  );

  return msgInfo;
};

export const isJSONString = (string:string) => {
  try {
    const json = JSON.parse(string);
    return json;
  } catch (e) {
    return false;
  }
};
