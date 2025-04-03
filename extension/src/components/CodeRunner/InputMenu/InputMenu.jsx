import { useEffect, useState } from "react";
import { changeTheme } from "../../../utils/Theme";
import { editorState, langState, serverStatusState, supportedLangState } from "../../../utils/atom";
import { sampleExample } from "./sampleExample.jsx";
import { useRecoilState, useRecoilValue } from "recoil";
import "./InputMenu.css";
import { bojApi } from "../../../api/BOJApi.js";
import { useQuery } from "@tanstack/react-query";

export const InputMenu = () => {
  
  const editor = useRecoilValue(editorState);
  const savedCode = localStorage.getItem(window.location.pathname);
  const savedLang = localStorage.getItem("lang");
  const [folded, setFolded] = useState(savedCode ? true : false);
  const [langFolded, setLangFolded] = useState(true)
  const [lang, setLang] = useRecoilState(langState)
  const [isConnected,setIsConnected] = useRecoilState(serverStatusState);
  const [supportedLang, setSupportedLang] = useRecoilState(supportedLangState)
  const getServerStatus = async () =>{
    try{
      const {connected, supportedLang} = await bojApi.health()
      setSupportedLang(supportedLang)
      setIsConnected(connected)
      if(!connected) return
      setLang(savedLang || lang);
    } catch(e) {
      console.log(e)
    }
  }
  useQuery({
    queryKey: ["health"],
    queryFn: getServerStatus,
    refetchInterval: 5000,
    staleTime: 10000, 
  });
  useEffect(()=> getServerStatus(),[])
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
            {sampleExample?.[lang].map((sample, index) => (
              <button
                onMouseDown={({ target }) => {
                  setFolded(true);
                  editor.setValue(
                    sampleExample?.[lang]?.[target.className.replace(/[a-zA-Z]/g, "")]?.code||''
                  );
                }}
                className={`ex${index}`}
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
          <button
            className={`lang-popup ${!isConnected?"connect-error":''}`}
            onClick={() => {if(isConnected)setLangFolded(!langFolded)}}
            onBlur={() => setLangFolded(true)}
          >
            {lang}
          </button>
          <div className={(langFolded ? "folded" : "") + " example-hint"}>
          {isConnected&&supportedLang.map((langItem, index) => (
            <button
              onMouseDown={() => {
                setLangFolded(true);
                setLang(langItem)
                editor.setValue('')
                localStorage.setItem("lang", langItem);
              }}
              className={`ex${index}`}
            >
              {langItem}
            </button>
          ))}
          </div>
        </div>
        {!isConnected&&<div className="connect-error">오프라인 모드</div>}
      </div>
    </div>
  );
};
