const sample_dictionary = [
  "\n\n입력값 없음",
  "input\n\n입력 값 1개",
  "arr[0], arr[1], ...arr[n]\n\n빈칸을 두고 값 정렬",
  "각 줄에 값 정렬\n\n예시:\narr[0]\narr[1]\n...\narr[n]",
  "N\narr[0], arr[1], ...arr[n]\n\n첫째 줄에 N, 두 번째 줄에 값 정렬\n\n",
  "N\narr[0]\narr[1]\n...\narr[n]\n\n첫째 줄에 N, 두 번째줄부터 값 정렬\n\n",
];

const sample_object = {
  sn0: ``,
  sn1: `const input = require('fs').readFileSync('/dev/stdin').toString().trim();
  `,
  sn2: `const arr = require('fs').readFileSync('/dev/stdin').toString().trim().split(' ');
  `,
  sn3: `const arr = require('fs').readFileSync('/dev/stdin').toString().trim().split("\\\\n");
  `,
  sn4: `const [n, ...arr] = require('fs').readFileSync('/dev/stdin').toString().trim().split(/\\\\s/);
  `,
  sn5: `const [n, ...arr] = require('fs').readFileSync('/dev/stdin').toString().trim().split('\\\\n');
  `,
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
    if (target.target.classList[0] === "example_toggle_button") {
      toggle_example();
    }
  });
}
function createIframeController() {
  const iframeController = document.createElement("div");
  const container = document.querySelector(".content");
  container.append(iframeController);
  iframeController.classList.add("iframe_controller");
  iframeController.innerHTML = `<button class="iframe_question">문제 사이즈</button><button class="iframe_code">코드창 사이즈</button><button class="iframe_hide_code">코드창 숨기기</button><button class="example_toggle_button">입력 예시창</button>`;
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
function toggle_example() {
  document.querySelector(".input_selector").classList.toggle("displayNone");
}
function readInput() {
  const input_list = [];
  document
    .querySelectorAll(`[id*="sample-input-"]`)

    .forEach((element) =>
      input_list.push(element.innerText ? element.innerText : element.value)
    );
  return input_list;
}
function readOutput() {
  const output_list = [];
  document
    .querySelectorAll(`[id*="sample-output-"]`)
    .forEach((element) =>
      output_list.push(element.innerText ? element.innerText : element.value)
    );
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
const IframeScript = `
`;
function createIframeEvent(sample_example) {
  const input_list = JSON.stringify(readInput());
  const output_list = JSON.stringify(readOutput());
  const PATH = window.location.pathname;
  return `
    <script>
      const PATH = "${PATH}"
      var editor;
      require.config({
        paths: {
          vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs",
        },
      });
      require(["vs/editor/editor.main"], () => {
        editor= monaco.editor.create(document.getElementById("container"), {
          value: \`${sample_example}\`,
          language: "javascript",
          theme: "vs-dark",
          minimap: { enabled: false },
          automaticLayout: true,
        });

      });
      const run =function(inputValue, index){
        const body = document.querySelector(".code_output_wrapper");
        console.log = function(){
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
          const text_container = document.createElement('div')
          text_container.append(txt)
          code_evaluation.append(text_container);
        }

        require = function(fs){return {readFileSync : function(){ return inputValue}}};
        const value = editor.getValue() 
        const fn = new Function(value);
        fn(); 
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
          if (event.altKey && event.keyCode === 13) {
            createAllResult()
          }
        })
      window.addEventListener('beforeunload', ()=>{
        localStorage.setItem(PATH,editor.getValue())
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
const hintPosition = document
  .getElementById("problem_hint")
  .closest(".col-md-12");
function createSampleNode(sampleNumber) {
  const sampleNode = document.createElement("div");
  sampleNode.innerHTML = `
  <div class="col-md-12">
  <div class="row">
    <div class="col-md-6">
      <section id="sampleinput${sampleNumber}">
        <div class="headline">
          <h2>
            예제 입력 ${sampleNumber}
            <button
              type="button"
              class="btn btn-link copy-button"
              style="padding: 0px"
              data-clipboard-target="#sample-input-${sampleNumber}"
            >
              복사
            </button>
          </h2>
        </div>
        <textarea class="sampledata" id="sample-input-${sampleNumber}">입력을 입력해주세요</textarea>
      </section>
    </div>
    <div class="col-md-6">
      <section id="sampleoutput${sampleNumber}">
        <div class="headline">
          <h2>
            예제 출력 ${sampleNumber}
            <button
              type="button"
              class="btn btn-link copy-button"
              style="padding: 0px"
              data-clipboard-target="#sample-output-${sampleNumber}"
            >
              복사
            </button>
          </h2>
        </div>
        <textarea class="sampledata" id="sample-output-${sampleNumber}">출력을 입력해주세요</textarea>
      </section>
    </div>
  </div>
</div>
  `;
  hintPosition.before(sampleNode);
  console.log();
}
// function
function createSample() {
  const sampleButton = document.createElement("button");
  const hintPosition = document
    .getElementById("problem_hint")
    .closest(".col-md-12");
  sampleButton.innerText = "예제 추가하기";
  hintPosition.after(sampleButton);
  sampleButton.classList.add("btn-add-sample");
  // createSampleNode(6);
}

function init() {
  createIframeController();
  createInputText();

  const checkStorage = localStorage.getItem(window.location.pathname);
  const input_selector = document.querySelector(".input_selector");
  const iframeHeadText = createHeadText(IframeScript);
  const iframeBodyText = createBodyText(IFRAMECSS);
  input_selector.addEventListener("click", (target) => {
    if (!target.target.classList[0].includes("sn")) return;
    const run_div = document.querySelectorAll(".run_div");
    if (run_div !== null) {
      run_div.forEach((element) => element.remove());
    }
    const sample_object_key = target.target.classList;
    const iframeEvent = createIframeEvent(sample_object[sample_object_key]);
    const iframeHTML = createIframeHTML(
      iframeHeadText,
      iframeBodyText,
      iframeEvent
    );
    createIframe(iframeHTML);
    close_example();
  });
  if (checkStorage !== null) {
    const iframeEvent = createIframeEvent(
      checkStorage.replace(/\\/g, "\\\\").replace(/·/g, " ")
    );
    const iframeHTML = createIframeHTML(
      iframeHeadText,
      iframeBodyText,
      iframeEvent
    );
    createIframe(iframeHTML);
    close_example();
  }
  createSample();
}
init();
