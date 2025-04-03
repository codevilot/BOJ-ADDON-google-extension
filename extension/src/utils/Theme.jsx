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
