import * as monaco from "monaco-editor";

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
  const mode = localStorage.getItem("mode");
  Object.entries(themeObject[mode].colorset).forEach(([key, valuez]) => {
    document.documentElement.style.setProperty(key, valuez);
  });

  return mode;
};

export const setTheme = () => {
  if (!localStorage.getItem("mode")) localStorage.setItem("mode", "vs-dark");
  return changeThemeProperty();
};
export const changeTheme = () => {
  const mode = localStorage.getItem("mode");
  monaco.editor.setTheme(themeObject[mode].to);
  localStorage.setItem("mode", themeObject[mode].to);
  changeThemeProperty();
};
