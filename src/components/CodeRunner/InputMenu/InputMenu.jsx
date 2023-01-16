import { useState } from "react";
import { useRecoilValue } from "recoil";
import { changeTheme } from "../../../utils/Theme";
import { editorState } from "../../../utils/atom";
import { sampleExample } from "./sampleExample.jsx";
import "./InputMenu.css";

export const InputMenu = () => {
  const editor = useRecoilValue(editorState);
  const savedCode = localStorage.getItem(window.location.pathname);
  const [folded, setFolded] = useState(savedCode ? true : false);

  return (
    <div className="boj-addon-menu">
      <div className="boj-addon-nav">
        <button
          className="example-popup"
          onClick={() => setFolded(!folded)}
          onBlur={() => setFolded(true)}
        >
          입력 예시창
        </button>
        <button className="dark-mode" onClick={changeTheme}>
          테마 변경
        </button>
      </div>
      <div className={(folded ? "folded" : "") + " example-hint"}>
        {sampleExample.map((sample, index) => (
          <button
            onMouseDown={({ target }) => {
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
