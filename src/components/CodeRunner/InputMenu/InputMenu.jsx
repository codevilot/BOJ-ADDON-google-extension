import { useContext, useState } from "react";
import { BojAddonContextStore } from "../../../utils/store.jsx";
import { sampleExample } from "./sampleExample.jsx";
import "./InputMenu.css";

export const InputMenu = () => {
  const { editor } = useContext(BojAddonContextStore);
  const savedCode = localStorage.getItem(window.location.pathname);
  const [folded, setFolded] = useState(savedCode ? true : false);

  return (
    <div className="boj-addon-menu">
      <div className="boj-addon-nav">
        <div className="example-popup" onClick={() => setFolded(!folded)}>
          입력 예시창
        </div>
      </div>
      <div className={(folded ? "folded" : "") + " example-hint"}>
        {sampleExample.map((sample, index) => (
          <button
            onClick={({ target }) => {
              setFolded(true);
              editor.setValue(
                sampleExample[target.className.replace(/[a-zA-Z]/g, "")].code
              );
            }}
            className={`ex${index}`}
          >
            {sample.button}
          </button>
        ))}
      </div>
    </div>
  );
};
