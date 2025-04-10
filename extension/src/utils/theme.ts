import * as monaco from "monaco-editor";
import { bojStorage } from "./bojStorage";

const themeObject = {
  "vs-dark": {
    to: "vs",
    colorset: {
      "--background-color": "#454545",
      "--editor-color": "#1e1e1e",
      "--font-color": "white",
      "--edge-color": "#454545",
      "--sample-color": "#2c2c2c",

      "--font-color-100": "#ccc",    
      "--font-color-200": "#eee",    
      "--font-color-300": "#d0d4dc", 
      "--font-color-400": "#c4cbd0", 
      "--font-color-500": "#b4b8bb",
      "--header-logo-filter": "brightness(1000%) invert(0%)"
    },
  },
  vs: {
    to: "vs-dark",
    colorset: {
      "--background-color": "#f7f7f7",
      "--editor-color": "white",
      "--font-color": "black",
      "--edge-color": "#eee",
      "--sample-color": "#323232",

      "--font-color-100": "#555",   
      "--font-color-200": "#333",
      "--font-color-300": "#585f69",
      "--font-color-400": "#687074",
      "--font-color-500": "#7c8082" ,
      "--header-logo-filter": "none" 
    },
  },
};

export const changeThemeProperty = () => {
    const mode = (bojStorage.getItem("mode") ?? "vs-dark") as keyof typeof themeObject;
    const theme = themeObject[mode];
  
    Object.entries(theme.colorset).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  
    return mode;
  };
  
  export const setTheme = () => {
    if (!bojStorage.getItem("mode")) {
      bojStorage.setItem("mode", "vs-dark");
    }
    return changeThemeProperty();
  };
  
  export const changeTheme = () => {
    const mode = (bojStorage.getItem("mode") ?? "vs-dark") as keyof typeof themeObject;
    const theme = themeObject[mode];
  
    monaco.editor.setTheme(theme.to);
    bojStorage.setItem("mode", theme.to);
    changeThemeProperty();
  };  