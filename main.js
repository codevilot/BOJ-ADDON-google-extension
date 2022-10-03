(() => {
  const resizer = (() => {
    const bar = document.createElement("div");
    document.querySelector(".wrapper").append(bar);
    bar.classList.add("resize-bar");
    bar.innerHTML = `
    <div class="resize-icon">
      <div></div>
      <div></div>
      <div></div>
    </div>
    `;
    return bar;
  })();

  resizer.addEventListener("mousedown", () => {
    const resizing = (cursor) => {
      const rootStyle = document.querySelector(":root").style;
      const resizeBarWidth = 40;
      console.log(resizeBarWidth, rootStyle);
      rootStyle.setProperty(
        "--code-window-width",
        ((cursor.x + resizeBarWidth) / parseInt(window.innerWidth)) * 100
      );
    };
    document.addEventListener("mousemove", resizing, false);
    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", resizing, false);
      },
      false
    );
  });
})();

(() => {
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
  }

  const insertSample = () => {
    const readInput = () =>
      [...document.querySelectorAll(`[id*="sample-input-"]`)].map((input) =>
        input.innerText ? input.innerText : input.value
      );
    const readOutput = () =>
      [...document.querySelectorAll(`[id*="sample-output-"]`)].map((output) =>
        output.innerText ? output.innerText : output.value
      );
    localStorage.setItem("tempInput", JSON.stringify(readInput()));
    localStorage.setItem("tempOutput", JSON.stringify(readOutput()));
  };

  const createSample = () => {
    const sampleButton = document.createElement("button");
    const checkButton = document.createElement("button");
    const hintPosition = document
      .getElementById("problem_hint")
      .closest(".col-md-12");

    sampleButton.innerText = "예제 추가하기";
    checkButton.innerText = "예제 적용하기";
    hintPosition.after(sampleButton);
    hintPosition.after(checkButton);
    sampleButton.classList.add("btn-add-sample");
    checkButton.classList.add("btn-add-check");
    const getSampleNumber = () =>
      document.querySelectorAll(`[id*="sample-input-"]`).length;
    sampleButton.addEventListener("click", () =>
      createSampleNode(getSampleNumber())
    );
    checkButton.addEventListener("click", () => insertSample());
  };
  localStorage.setItem("path", window.location.pathname);
  createSample();
  insertSample();
})();

(() => {
  {
    const iframe = document.createElement("iframe");
    const iframe_wrapper = document.querySelector(".content .row");
    iframe.frameBorder = "0";
    iframe.classList.add("boj-addon");
    iframe_wrapper.append(iframe);
    iframe.srcdoc = `
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link
          rel="stylesheet"
          data-name="vs/editor/editor.main"
          href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs/editor/editor.main.min.css"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs/loader.min.js"></script>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>BOJ addon</title>
      </head>
      <body>
        <style>
          ::-webkit-scrollbar {
            width: 10px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          ::-webkit-scrollbar-thumb {
            background: #888;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          body {
            margin: 0px;
            height: 100vh;
            padding-left:1rem;
            padding-right:1rem;
            border-radius:10px;
            background: #1e1e1e;  
          }
          .hidden {
            display: none;
          }
          .correct {
            color: green;
          }
          .wrong {
            color: red;
          }

          .boj-addon-menu {
            background: #1e1e1e;
            color: white;
            padding: 0.5rem 0.3rem;
          }

          .example-hint {
            position: absolute;
            background-color:rgb(50,50,50,1);
            z-index: 1;
            top:2.5rem;
          }
          
          .run-result-list {
            background: #1e1e1e;
            height: 20vh;
            overflow-y:scroll;
          }
          .run-result-list > div{
            padding:0.3rem;
            margin-bottom:0.3rem;
            background-color:rgba(255, 255, 255, 0.1);
          }
          .run_code {
            position: absolute;
            right: 0;
            top:0;
            height: min-content;
            padding: 10px 15px;
            border: 0;
            color: #fff;
            background-color: #428bca;
            font-size: 0.7rem;
          }
          .run-navigation{
            position:relative;
            color:white;
            padding:0.5rem;
          }
          .running-status{
            background:#428bca;color:white;padding:0.1rem 0.5rem;margin-left:1rem; border-radius:5px;
          }
          .example-hint button {
            display: block;
            white-space: pre-line;
            text-align:left;
            width:100%;
            background: none;
            color: white;
            padding:0.5rem 1rem;
            margin-bottom:1rem;
            border-bottom:1px solid white;
            border-right:0;
            border-left:0;
            border-top:0;
          }
          .example-popup{
            padding-bottom:0.5rem;
          }
          .boj-addon-nav {
            display: flex;
            gap: 1rem;
          }
        </style>
        <div class="boj-addon-menu">
          <div class="boj-addon-nav">
            <div class="example-popup">입력 예시창</div>
          </div>
          <div class="example-hint ${
            localStorage.getItem(localStorage.getItem("path"))?.trim().length >
            0
              ? "hidden"
              : ""
          }"></div>
        </div>
    
        <div id="container" style="height: calc( 80vh - 6rem ); border: 1px solid black"></div>
        <div class="run-navigation">
          <span>실행결과</span>
          <span class="running-status hidden">실행 중</span>
          <button class="run_code">실행(ALT+ENTER)</button>
        </div>
        <div class="run-result-list"></div>
       <script>
        const CODE_RUNNING_TIME=500
        let input_list =JSON.parse(localStorage.getItem('tempInput'))
        let output_list =JSON.parse(localStorage.getItem('tempOutput'))
        let console_stack = "";
        var editor;
        require.config({
          paths: {
            vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs",
          },
        });
        require(["vs/editor/editor.main"], () => {
          editor = monaco.editor.create(document.getElementById("container"), {
            value: localStorage.getItem(localStorage.getItem('path')),
            fontSize: "18px",
            language: "javascript",
            theme: "vs-dark",
            minimap: { enabled: false },
            automaticLayout: true,
          });
        });

        

        console.log = function (...args) {
          console_stack = console_stack +
            (console_stack === '' ? '' : '\\n') +
            [...args].map(arg=>
              arg instanceof Set ||
                arg instanceof Map ? JSON.stringify([...arg]) :
                arg instanceof Array || 
                arg instanceof Object? JSON.stringify(arg):
                arg
              ).join(' ');
        };
        const example = {
          ex0: { button: '입력값 없음', code: '' },
          ex1: {
            button: 'input\\n\\n입력 값 1개',
            code: 'const input = require("fs").readFileSync("/dev/stdin").toString().trim();',
          },
          ex2: {
            button: 'arr[0], arr[1], ...arr[n]\\n\\n빈칸을 두고 값 정렬',
            code: 'const arr = require("fs").readFileSync("/dev/stdin").toString().trim().split(" ");',
          },
          
        ex3: {
          button: 'arr[0]\\narr[1]\\n...\\narr[n]\\n\\n각 줄에 값 정렬',
          code: 'const arr = require("fs").readFileSync("/dev/stdin").toString().trim().split("\\\\n");',
        },
        ex4: {
          button:
            'N\\narr[0], arr[1], ...arr[n]\\n\\n첫째 줄에 N, 두 번째 줄에 값 정렬\\n',
          code: 'const [n, ...arr] = require("fs").readFileSync("/dev/stdin").toString().trim().split("\/\\\\s\/");',
        },
        ex5: {
          button:
            'N\\narr[0]\\narr[1]\\n...\\narr[n]\\n\\n첫째 줄에 N, 두 번째줄부터 값 정렬\\n',
          code: 'const [n, ...arr] = require("fs").readFileSync("/dev/stdin").toString().trim().split("\\\\n");',
        },
    };
    const $runResultList = document.querySelector(".run-result-list");
    const $btnRunCode = document.querySelector(".run_code");
    const $exampleHint = document.querySelector(".example-hint");
    const runCode = (input, output, i) =>{

      console_stack =""
      require = function(fs){return {readFileSync : function(){ return input}}};
      new Function(editor.getValue())()
  
      const isCorrect = (console_stack.trim()===output.trim())
  
     $runResultList.innerHTML = $runResultList.innerHTML+\`
     <div class="\${isCorrect?"correct":"wrong"}"> 
     <div>예제 \${i}</div>
      <div>입력 값 : \${input}</div>
      <div>입력 결과 : \${console_stack}</div> 
      <div>출력 결과 : \${output}</div> 
     </div>
      \`
     }
    document.querySelector(".example-hint").innerHTML = Object.values(example)
    .map((ex, index) => \`<button class="ex\${index}">\${ex["button"]}</button>\`).join("");
  
    document.querySelector('.boj-addon-menu').addEventListener('click', (e)=>{
      if(e.target.matches('button')){
      $exampleHint.classList.add('hidden')
      editor.setValue(example[e.target.classList[0]]["code"])}
    })    
    $btnRunCode.addEventListener("click", () => {
      document.querySelector('.running-status').classList.remove("hidden");
      input_list = JSON.parse(localStorage.getItem('tempInput'))
      output_list= JSON.parse(localStorage.getItem('tempOutput'))
      setTimeout(()=>{
        $runResultList.innerHTML =''
        output_list.forEach((output, index)=>{
          runCode(input_list[index]||"", output, index)
        })
        document.querySelector('.running-status').classList.add("hidden");
      }, CODE_RUNNING_TIME)

      
    });

    window.addEventListener("keydown", (event)=>{
      if (event.altKey && event.keyCode === 13) {
        document.querySelector('.running-status').classList.remove("hidden");
        input_list = JSON.parse(localStorage.getItem('tempInput'))
        output_list= JSON.parse(localStorage.getItem('tempOutput'))
        setTimeout(()=>{
          $runResultList.innerHTML =''
          output_list.forEach((output, index)=>{
            runCode(input_list[index]||"", output, index)
          })
          document.querySelector('.running-status').classList.add("hidden");
        }, CODE_RUNNING_TIME)
    
         }
       })
      window.addEventListener('beforeunload', ()=>{
        if(editor.getValue().trim().length> 0) localStorage.setItem(localStorage.getItem("path"),editor.getValue())
        else{localStorage.removeItem(localStorage.getItem("path"))}
      })
      document.body.addEventListener('click', ({target})=>
    {  if(!target.closest('.boj-addon-menu')) $exampleHint.classList.add('hidden')})
       </script>
      </body>
    </html>
  `;
  }
})();
