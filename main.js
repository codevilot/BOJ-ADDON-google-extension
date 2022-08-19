const sample_dictionary = [
  "하나의 값을 입력받을 때",
  "공백으로 구분된 한 줄의 값들을 입력받을 때",
  "여러 줄의 값들을 입력받을 때",
  "첫 번째 줄에 자연수 n을 입력받고, 그 다음줄에 공백으로 구분된 n개의 값들을 입력받을 때",
  "첫 번째 줄에 자연수 n을 입력받고, 그 다음줄부터 n개의 줄에 걸쳐 한 줄에 하나의 값을 입력받을 때",
  "하나의 값 또는 공백으로 구분된 여러 값들을 여러 줄에 걸쳐 뒤죽박죽 섞여서 입력받을 때",
];
const sample_object = {
  sn0: `const input = require('fs').readFileSync("/dev/stdin").toString().trim();`,
  sn1: `const input = require('fs').readFileSync("/dev/stdin").toString().trim().split(" ");`,
  sn2: `const input = require('fs').readFileSync("/dev/stdin").toString().trim().split("\\n");`,
  sn3: `const [n, ...arr] = require('fs').readFileSync("/dev/stdin").toString().trim().split(/\\s/);`,
  sn4: `const [n, ...arr] = require('fs').readFileSync("/dev/stdin").toString().trim().split("\\n");`,
  sn5: `const input = require('fs').readFileSync("/dev/stdin").toString().trim().split(/\\s/);
  const n = input[0];
  const n_arr = input.slice(1, n+1);
  const [m, ...m_arr] = input.slice(n+1);`,
};

function displayAnswer(outputValue, index) {
  const code_result = document
    .querySelector(".code_result")
    .querySelector(`.run_result${index}`);
  const answer_div = document.createElement("div");
  const run_output = code_result.querySelector(`.run_output${index}`);
  code_result.append(answer_div);
  answer_div.classList.add(`answer_result${index}`);
  answer_div.append(outputValue);

  if (answer_div.innerHTML.trim() === run_output.innerHTML.trim()) {
    answer_div.classList.add("correct");
  } else {
    answer_div.classList.add("wrong");
  }
}
function clearOutput() {
  const code_result = document.querySelector(".code_result");
  code_result.innerHTML = "";
}
function run(inputValue, index) {
  const code = document.querySelector(".code_area").value;
  const script = `
    var console = {};
      console.log = function (text) {
      const code_result = document.querySelector(".code_result");
      const code_evaluation = document.createElement("div");
      const run_output = document.createElement("div");
      const txt = document.createTextNode([...arguments].reduce((acc, cur)=>acc+cur+" ", ""));
      
      code_evaluation.classList.add("run_result${index}")
      code_result.appendChild(code_evaluation);
      code_evaluation.append(run_output);
      run_output.appendChild(txt);
      run_output.classList.add(\`run_output${index}\`)
    }
    require = function (fs){
      return {
        readFileSync : function(state){
          return \`${inputValue}\`
        }
      }
    }

    ;`;
  const fn = new Function(script + code);
  console.log(fn());
}
function close_sample() {
  document.querySelector(".sample_container").classList.add("displayNone");
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
function sample_container() {
  const button_container_parent = document.querySelector(".run_div");
  const button_container = document.createElement("div");
  button_container_parent.append(button_container);
  button_container.classList.add("sample_container");
  sample_dictionary.forEach((element, index) => {
    const button_item = document.createElement("button");
    button_item.classList.add(`sn${index}`);
    button_item.innerHTML = element;
    button_container.append(button_item);
  });
  //event delegation
  button_container.addEventListener("click", (target) => {
    const sample_object_key = target.target.classList;
    document.querySelector(
      ".code_area"
    ).innerHTML = `${sample_object[sample_object_key]}`;
    close_sample();
  });
}
function container() {
  const run_div = document.createElement("div");
  run_div.classList.add("run_div");
  const run_area = document.querySelector(".content").querySelector(".row");
  run_area.append(run_div);

  const code_area = document.createElement("textarea");
  const code_run = document.createElement("button");
  const code_result = document.createElement("div");
  const code_answer = document.createElement("div");

  const input_list = readInput();
  const output_list = readOutput();
  code_area.classList.add("code_area");
  code_answer.classList.add("code_answer");
  run_div.append(code_area);
  run_div.append(code_answer);
  run_div.append(code_result);
  run_div.append(code_run);
  code_run.classList.add("code_run");
  code_run.innerHTML = `실행`;
  code_result.classList.add("code_result");

  code_run.addEventListener("click", () => {
    clearOutput();
    input_list.forEach((inputValue, index) =>
      run(inputValue.toString(), index)
    );
    output_list.forEach((outputValue, index) =>
      displayAnswer(outputValue.toString(), index)
    );
  });
}
function init() {
  container();
  sample_container();
}
init();
