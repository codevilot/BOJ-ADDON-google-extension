function run(inputValue, index) {
  const code = document.querySelector(".code_area").value;
  // const [n, ...arr] = require('fs').readFileSync("/dev/stdin").toString().trim().split(" ");
  const script = `
    var console = {};
    console.log = function (text) {
      const code_result = document.querySelector(".code_result");
      var element = document.createElement("div");
      var txt = document.createTextNode(text);
  
      element.appendChild(txt);
      element.classList.add("run_result${index}")
      code_result.appendChild(element);
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
(function () {
  const run_div = document.createElement("div");
  run_div.classList.add("run_div");
  const run_area = document.querySelector(".content").querySelector(".row");
  run_area.append(run_div);

  const code_area = document.createElement("textarea");
  const code_run = document.createElement("button");
  const code_result = document.createElement("pre");

  const input_list = readInput();
  code_area.classList.add("code_area");
  run_div.append(code_area);
  run_div.append(code_result);
  run_div.append(code_run);
  code_run.classList.add("code_run");
  code_run.innerHTML = `실행`;
  code_result.classList.add("code_result");

  code_run.addEventListener("click", () => {
    input_list.forEach((inputValue, index) =>
      run(inputValue.toString(), index)
    );
  });
})();
