import { readFileSync, writeFileSync } from "fs";

const initialJS = readFileSync("./dist/main.js", "utf8");
const fixedText = initialJS.replace(
  /[.0-9a-zA-Z]{1,}\+"[0-9a-zA-Z]{1,}(.ttf")/,
  '"https://unpkg.com/monaco-editor@latest/esm/vs/base/browser/ui/codicons/codicon/codicon.ttf"'
);
writeFileSync("./dist/main.js", fixedText);
