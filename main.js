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
  sn1: `const input = require('fs').readFileSync('/dev/stdin').toString().trim();
  `,
  sn2: `const input = require('fs').readFileSync('/dev/stdin').toString().trim().split(' ');
  `,
  sn3: `const input = require('fs').readFileSync('/dev/stdin').toString().trim().split("\\\\n");
  `,
  sn4: `const [n, ...arr] = require('fs').readFileSync('/dev/stdin').toString().trim().split(/\\\\s/);
  `,
  sn5: `const [n, ...arr] = require('fs').readFileSync('/dev/stdin').toString().trim().split('\\\\n');
  `,
  sn6: `const input = require('fs').readFileSync('/dev/stdin').toString().trim().split(/\\\\s/);
const n = input[0];
const n_arr = input.slice(1, n+1);
const [m, ...m_arr] = input.slice(n+1);`,
};
function createIframeControllerEvent() {
  const iframeController = document.querySelector(".iframe_controller");
  const eventTarget = document.querySelector(".content").querySelector(".row");
  iframeController.addEventListener("click", (target) => {
    if (target.target.classList[0] === "iframe_question") {
      eventTarget.classList.toggle("question_full");
      target.target.classList.toggle("on");
    }
    if (target.target.classList[0] === "iframe_code") {
      eventTarget.classList.toggle("code");
      target.target.classList.toggle("on");
    }
    if (target.target.classList[0] === "iframe_hide_code") {
      eventTarget.classList.toggle("hide_code");
      target.target.classList.toggle("on");
    }
  });
}
function createIframeController() {
  const iframeController = document.createElement("div");
  const container = document.querySelector(".content");
  container.append(iframeController);
  iframeController.classList.add("iframe_controller");
  iframeController.innerHTML = `<button class="iframe_question">문제 사이즈</button><button class="iframe_code">코드창 사이즈</button><button class="iframe_hide_code">코드창 숨기기</button>`;
  createIframeControllerEvent();
}
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
    .forEach((element) => input_list.push(`${element.innerText}`));
  return input_list;
}
function readOutput() {
  const output_list = [];
  document
    .querySelectorAll(`[id*="sample-output-"]`)
    .forEach((element) => output_list.push(element.innerText));
  return output_list;
}
const IFRAMECSS = `body{margin:0px;height:100vh;}
.table_row {
  padding-left: 0.5rem;   background: #1e1e1e;color:#fff;overflow:scroll;display:flex;height:19vh;position:relative;flex-flow: row wrap;
  padding-top: 0.5rem;
  box-sizing: border-box;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.table_row::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera*/
}
.table_row__input, .table_row__output{width:50%;}
.token.operator{background:none;}
.table_row, .code_output_wrapper{font-size:0.7rem;}
.code_output_wrapper{width:100%;}
.run_code {  position: absolute;  bottom:20%;;  right: 0;  height:min-content;padding: 10px 15px;border: 0;color: #fff;background-color: #428bca;font-size:0.7rem;}
[class*="run_wrapper"] {  border-bottom: 1px solid grey; display: flex;  gap: 1rem;}
[class*="answer_result"], [class*="code_evaluation"] {width:50%; word-break:break-all;  }
[class*="run_wrapper"].correct {color: green;}
[class*="run_wrapper"].wrong {color: red;}`;
const IframeScript = ``;
function createIframeEvent(sample_example) {
  const input_list = JSON.stringify(readInput());
  const output_list = JSON.stringify(readOutput());
  return `
    <script>
      require.config({
        paths: {
          vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs",
        },
      });
      require(["vs/editor/editor.main"], () => {
        monaco.editor.create(document.getElementById("container"), {
          value: \`${sample_example}\`,
          language: "javascript",
          theme: "vs-dark",
          minimap: { enabled: false },
          automaticLayout: true,
        });
      });

      const run =function(inputValue, index, isBlank){
        console.log = function(){
          const body = document.querySelector(".code_output_wrapper");
          if(document.querySelectorAll(".run_wrapper"+index)){
            const run_wrapper =document.createElement("div");
            run_wrapper.classList.add("run_wrapper"+index);            
            body.append(run_wrapper);
            const code_evaluation = document.createElement("div");
            run_wrapper.append(code_evaluation);
            code_evaluation.classList.add("code_evaluation"+index);
          }
          const txt = document.createTextNode([...arguments].reduce((acc, cur)=>
          cur instanceof Set ||cur instanceof Map ? acc+JSON.stringify([...cur]) :
          cur instanceof Array || cur instanceof Object ===true ? acc+JSON.stringify(cur):
          acc+cur+" ", ""))

          const code_evaluation = document.querySelector(".code_evaluation"+index);
          code_evaluation.append(txt);
        }
        if(isBlank){ console.log("출력할 값이 없습니다.")}
        require = function(fs){return {readFileSync : function(){ return inputValue}}};
        const value = document.querySelector(".view-lines").innerText.replace(/\xA0/g,' ');
        const fn = new Function(value);
        fn();
      }

      const displayAnswer= function(outputValue,index){   
        if(!document.querySelector(".code_evaluation"+index)){ run(false, index, true)}
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
        run(inputValue, index, false));
        ${output_list}.forEach((outputValue, index)=>
        displayAnswer(outputValue,index));
      }
      const run_code = document.querySelector(".run_code")
          run_code.addEventListener("click", () => {
            createAllResult()
          }

      );
      window.addEventListener("keydown", ()=>{
          if (event.altKey && event.keyCode === 13) {
            createAllResult()
          }
        })
    </script>
    `;
}
function createHeadText(script) {
  return `<head>
<meta charset="UTF-8" />
<link
rel="stylesheet"
data-name="vs/editor/editor.main"
href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs/editor/editor.main.min.css"
/>

<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs/loader.min.js"></script>
<script>${script}</script> 
</head>`;
}

function createBodyText(css) {
  return `<body><style>${css}</style>

  <div id="container" style="height: 80vh; border: 1px solid black"></div>
  <button class="run_code">실행(ALT+ENTER)</button>
  <div class="table_row">
<div class="table_row__input">입력값</div>
<div class="table_row__output">정답</div>
<div class="code_output_wrapper"></div>
</div>  
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
  createIframeController();
  createInputText();
  const input_selector = document.querySelector(".input_selector");
  input_selector.addEventListener("click", (target) => {
    if (!target.target.classList[0].includes("sn")) return;
    const sample_object_key = target.target.classList;
    const iframeBodyText = createBodyText(IFRAMECSS);
    const iframeEvent = createIframeEvent(sample_object[sample_object_key]);
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
