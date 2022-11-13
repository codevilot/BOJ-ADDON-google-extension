import { createContext, useState } from "react";
export const BojAddonContextStore = createContext();
const exampleNumber = document.querySelectorAll(`[id*="sample-input-"]`).length;

export const BojAddonContext = (props) => {
  const [testCode, setTestCode] = useState([]);

  const [editor, setEditor] = useState(null);
  const codeInfo = {
    exampleNumber,
    testCode,
    setTestCode,
    editor,
    setEditor,
  };
  return (
    <BojAddonContextStore.Provider value={codeInfo}>
      {props.children}
    </BojAddonContextStore.Provider>
  );
};
