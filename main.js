const sample_dictionary = [
  "빈값",
  "하나의 값을 입력받을 때",
  "공백으로 구분된 한 줄의 값들을 입력받을 때",
  "여러 줄의 값들을 입력받을 때",
  "첫 번째 줄에 자연수 n을 입력받고, 그 다음줄에 공백으로 구분된 n개의 값들을 입력받을 때",
  "첫 번째 줄에 자연수 n을 입력받고, 그 다음줄부터 n개의 줄에 걸쳐 한 줄에 하나의 값을 입력받을 때",
  "하나의 값 또는 공백으로 구분된 여러 값들을 여러 줄에 걸쳐 뒤죽박죽 섞여서 입력받을 때",
];
const sample_object = {
  sn0: ``,
  sn1: `const input = require('fs').readFileSync('/dev/stdin').toString().trim();`,
  sn2: `const input = require('fs').readFileSync('/dev/stdin').toString().trim().split(' ');`,
  sn3: `const input = require('fs').readFileSync('/dev/stdin').toString().trim().split('\\n');`,
  sn4: `const [n, ...arr] = require('fs').readFileSync('/dev/stdin').toString().trim().split(/\\s/);`,
  sn5: `const [n, ...arr] = require('fs').readFileSync('/dev/stdin').toString().trim().split('\\n');`,
  sn6: `const input = require('fs').readFileSync('/dev/stdin').toString().trim().split(/\\s/);
const n = input[0];
const n_arr = input.slice(1, n+1);
const [m, ...m_arr] = input.slice(n+1);`,
};
function createInputText() {
  const input_selector_wrapper = document
    .querySelector(".content")
    .querySelector(".row");
  const input_selector = document.createElement("div");
  input_selector_wrapper.append(input_selector);
  input_selector.classList.add("input_selector");
  sample_dictionary.forEach((element, index) => {
    const button_item = document.createElement("button");
    button_item.classList.add(`sn${index}`);
    button_item.innerHTML = element;
    input_selector.append(button_item);
  });
}
function close_example() {
  document.querySelector(".input_selector").classList.add("displayNone");
}
function readInput() {
  const input_list = [];
  document
    .querySelectorAll(`[id*="sample-input-"]`)
    .forEach((element) => input_list.push(`${element.innerHTML}`));
  return input_list;
}
function readOutput() {
  const output_list = [];
  document
    .querySelectorAll(`[id*="sample-output-"]`)
    .forEach((element) => output_list.push(element.innerHTML));
  return output_list;
}
const IFRAMECSS = `body{margin:0px;}
.table_row{display:flex;margin-top:45px;}
.table_row__input, .table_row__output{width:50%;}
code-input textarea, pre, code[class*="language-"], pre[class*="language-"] {width:100vw!important;
  word-break: break-word;
  white-space: pre-wrap;}
  .token.operator{background:none;}
code-input{margin:0px;height: 500px;width: 100vw;padding: 0px;}
code-input textarea, pre{box-sizing: border-box;}
.run_code {float: right;padding: 10px 15px;border: 0;color: #fff;background-color: #428bca;}
[class*="run_wrapper"] {  border-bottom: 1px solid black; display: flex;  gap: 1rem;}
[class*="answer_result"], [class*="code_evaluation"] {width:50%; word-break:break-all;  }
[class*="run_wrapper"].correct {color: green;}
[class*="run_wrapper"].wrong {color: red;}`;
const IframeScript = `codeInput.registerTemplate( "code-input",  codeInput.templates.prism(Prism, [new codeInput.plugins.Indent()]));`;
function createIframeEvent() {
  const input_list = JSON.stringify(readInput());
  const output_list = JSON.stringify(readOutput());
  return `
    <script>
      const run =function(inputValue, index){
        console.log = function(){
          const body = document.querySelector(".code_output_wrapper");
          const run_wrapper =document.createElement("div");
          const code_evaluation = document.createElement("div");
          const txt = document.createTextNode([...arguments].reduce((acc, cur)=> 
          typeof cur==="object" ? acc+JSON.stringify(cur) : acc+cur+" ", ""));
          body.append(run_wrapper)
          run_wrapper.classList.add("run_wrapper"+index);
          run_wrapper.append(code_evaluation);
          code_evaluation.classList.add("code_evaluation"+index);
          code_evaluation.appendChild(txt);
        }

        require = function(fs){
          return {readFileSync : function(state){
          return inputValue}}};
        const value = document.querySelector("textarea").value;
        const fn = new Function(value)
        fn()  
      }

      const displayAnswer= function(outputValue,index){
        
        const code_evaluation = document.querySelector(".code_evaluation"+index);
        const code_result = document.querySelector(".run_wrapper"+index);
        const answer_div =  document.createElement("div");
        code_result?.append(answer_div);
        answer_div.classList.add("answer_result"+index);
        answer_div.append(outputValue);
        if (answer_div?.innerHTML.trim() === code_evaluation?.innerHTML.trim()) {
          code_result.classList.add("correct");
        } else {
          code_result.classList.add("wrong");
        }
      }
      const createAllResult= function(){
        document.querySelector('.code_output_wrapper').innerHTML="";
        ${input_list}.forEach((inputValue, index) =>
        run(inputValue, index));
        ${output_list}.forEach((outputValue, index)=>
        displayAnswer(outputValue,index));
      }
      const run_code = document.querySelector(".run_code")
          run_code.addEventListener("click", () => {
            createAllResult()
          }

      );
      window.addEventListener("keydown", ()=>{
          if (event.ctrlKey && event.keyCode === 13) {
            createAllResult()
          }
        })
    </script>
    `;
}
function createHeadText(script) {
  return `<head>
<meta charset="UTF-8" />
<link id="import-theme" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/themes/prism.css"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/components/prism-core.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/plugins/autoloader/prism-autoloader.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@1.1/code-input.css"/>
<script src="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@1.1/code-input.js"></script>
<script src="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@1.1/plugins/indent.js"></script>
<script src="https://cdn.jsdelivr.net/gh/WebCoder49/code-input@1.1/plugins/autodetect.js"></script>
<script>${script}</script> 
</head>`;
}

function createBodyText(sample, css) {
  return `<body><style>${css}</style>
<code-input lang="JavaScript" value=${sample}></code-input>
<script>codeInput.registerTemplate("code-input",codeInput.templates.prism(Prism));</script>

<button class="run_code">실행(CTRL+ENTER)</button>
<div class="table_row">
<div class="table_row__input">입력값</div>
<div class="table_row__output">정답</div>
</div>  
<div class="code_output_wrapper"></div>
</body>`;
}
function createIframeHTML(head, body, event) {
  return `<html lang="en">${head} ${body}${event}</html>`;
}

function createIframe(text) {
  const iframe = document.createElement("iframe");
  const iframe_wrapper = document
    .querySelector(".content")
    .querySelector(".row");
  iframe_wrapper.append(iframe);
  iframe.classList.add("run_div");
  iframe.srcdoc = `${text}`;
  iframe.frameBorder = "0";
}

function init() {
  createInputText();
  const input_selector = document.querySelector(".input_selector");
  input_selector.addEventListener("click", (target) => {
    const sample_object_key = target.target.classList;
    const iframeBodyText = createBodyText(
      `"${sample_object[sample_object_key]}"`,
      IFRAMECSS
    );

    const iframeEvent = createIframeEvent();
    const iframeHeadText = createHeadText(IframeScript);
    const iframeHTML = createIframeHTML(
      iframeHeadText,
      iframeBodyText,
      iframeEvent
    );
    createIframe(iframeHTML);
    close_example();
  });
}
init();
