import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { editorModeState, editorState, langState, serverStatusState, supportedLangState } from "../utils/atom";
import { bojApi } from "../api/bojApi";
import { useQuery } from "@tanstack/react-query";
import { sampleCode } from "../const/sampleCode";
import { getLangByCode, isSupportedLang } from "../utils/lang";
import { changeTheme } from "../utils/theme";
import { path } from "../utils/path";
import "./InputMenu.css"
import { bojStorage } from "../utils/bojStorage";
export const InputMenu = () => {
  
  const editor = useRecoilValue(editorState);
  const savedLang = bojStorage.getItem("lang");
  const [folded, setFolded] = useState(true);
  const [langFolded, setLangFolded] = useState(true)
  const [lang, setLang] = useRecoilState(langState)
  const [isConnected,setIsConnected] = useRecoilState(serverStatusState);
  const [supportedLang, setSupportedLang] = useRecoilState(supportedLangState)
  const [editorMode, setEditorMode] = useRecoilState(editorModeState);
  const storageValid = bojStorage.isValidPage()

  const pageLang = storageValid? lang 
                    : getLangByCode((document.querySelector("select#language") as HTMLSelectElement).value) 
  const getServerStatus = async () =>{
    try{
      const {connected, supportedLang} = await bojApi.health()
      setSupportedLang(supportedLang)
      setIsConnected(connected)
      if(!connected) return
      isSupportedLang(savedLang) && setLang(savedLang || lang);
    } catch(e) {
      console.log(e)
    }
  }
  const changeEditor = () =>{
    const updatedMode = !editorMode
    setEditorMode(updatedMode)
    bojStorage.setItem('editor-mode', `${updatedMode}`);
  }
  useQuery({
    queryKey: ["health"],
    queryFn: getServerStatus,
    refetchInterval: 5000,
    staleTime: 10000, 
  });
  return (
    <div className="boj-addon-menu">
      <div className="boj-addon-nav">
        <div>
          <button
          className="example-popup"
          onClick={() => setFolded(!folded)}
          onBlur={() => setFolded(true)}
          >
          입력 예시창
          </button>
          <div className={(folded ? "folded" : "") + " example-hint"}>
          {sampleCode?.[pageLang].map((sample, index) => (
            <button
                key={index}
                className={`ex${index}`}
                onMouseDown={(e) => {
                  setFolded(true);
                  const className = e.currentTarget.className;
                  const i = Number(className.replace(/[a-zA-Z]/g, ""));
                  editor?.setValue(sampleCode?.[pageLang]?.[i]?.code || '');
                }}
            >
                {sample.button}
            </button>
            ))}

          </div>
        </div>
        <div>
          <button className="dark-mode" onClick={changeTheme}>
            테마 변경
          </button>
        </div>
        <div>
        { <button
            className={`lang-popup ${!isConnected?"connect-error":''}`}
            onClick={() => {if(isConnected)setLangFolded(!langFolded)}}
            onBlur={() => setLangFolded(true)}
            disabled={!storageValid}
          >
            {storageValid?lang: document.querySelector(".chosen-single")?.textContent ||'nodejs'}
          </button>}
          <div className={(langFolded ? "folded" : "") + " example-hint"}>
          {isConnected&&supportedLang.map((langItem, index) => (
            <button
              onMouseDown={() => {
                setLangFolded(true);
                setLang(langItem)
                editor && editor.setValue('')
                bojStorage.setItem("lang", langItem);
              }}
              className={`ex${index}`}
            >
              {langItem}
            </button>
          ))}
          </div>
        </div>
        {!isConnected&&<div ><button className="connect-error">오프라인</button></div>}
        {path.getIsLogin() && <div>
          <button className="dark-mode" onClick={changeEditor}>
            에디터 변경
          </button>
        </div>}
      </div>
    </div>
  );
};
