// // 1. 하나의 값을 입력받을 때
// const fs = require('fs');
// const input = fs.readFileSync("/dev/stdin").toString().trim();

// // 2. 공백으로 구분된 한 줄의 값들을 입력받을 때
// const fs = require('fs');
// const input = fs.readFileSync("/dev/stdin").toString().trim().split(" ");

// // 3. 여러 줄의 값들을 입력받을 때
// const fs = require('fs');
// const input = fs.readFileSync("/dev/stdin").toString().trim().split("\n");

// // 4. 첫 번째 줄에 자연수 n을 입력받고, 그 다음줄에 공백으로 구분된 n개의 값들을 입력받을 때
// const fs = require('fs');
// const [n, ...arr] = fs.readFileSync("/dev/stdin").toString().trim().split(/\s/);

// // 5. 첫 번째 줄에 자연수 n을 입력받고, 그 다음줄부터 n개의 줄에 걸쳐 한 줄에 하나의 값을 입력받을 때
// const fs = require('fs');
// const [n, ...arr] = fs.readFileSync("/dev/stdin").toString().trim().split("\n");

// // 6. 하나의 값 또는 공백으로 구분된 여러 값들을 여러 줄에 걸쳐 뒤죽박죽 섞여서 입력받을 때
// // ex) n 입력 - 공백으로 구분된 n개의 값 입력 - m 입력 - 여러 줄에 걸쳐 m개의 값 입력
// const fs = require('fs');
// const input = fs.readFileSync("/dev/stdin").toString().trim().split(/\s/);
// const n = input[0];
// const n_arr = input.slice(1, n+1);
// const [m, ...m_arr] = input.slice(n+1);
(function () {
  const input_example = [
    "1. 하나의 값을 입력받을 때",
    "2. 공백으로 구분된 한 줄의 값들을 입력받을 때",
    "3. 여러 줄의 값들을 입력받을 때",
    "4. 첫 번째 줄에 자연수 n을 입력받고, 그 다음줄에 공백으로 구분된 n개의 값들을 입력받을 때",
    "5. 첫 번째 줄에 자연수 n을 입력받고, 그 다음줄부터 n개의 줄에 걸쳐 한 줄에 하나의 값을 입력받을 때",
    "6. 하나의 값 또는 공백으로 구분된 여러 값들을 여러 줄에 걸쳐 뒤죽박죽 섞여서 입력받을 때",
  ];

  const addressKey = window.location.href.split("/").slice(-2);
  const num = addressKey[1];
  const bool = localStorage.getItem(`${num}`);
  if (addressKey[0] === "submit") {
    if (bool === "true") {
      const desc = localStorage.getItem(`${num}_desc`);
      const input = localStorage.getItem(`${num}_input`);
      const output = localStorage.getItem(`${num}_output`);
      const samplein = localStorage.getItem(`${num}_samplein`);
      const sampleout = localStorage.getItem(`${num}_sampleout`);
      const target = document.querySelectorAll(".col-md-12")[1];
      const container = document.createElement("div");
      target.classList.add("spread");
      container.classList.add("desc");
      target.appendChild(container);
      container.innerHTML = `
            <div class="headline"><h2>문제</h2></div>
            <div class="problem-text-submit">${desc}</div>
            <div class="headline"><h2>입력</h2></div>
            <div class="problem-text-submit">${input}</div>
            <div class="headline"><h2>출력</h2></div>
            <div class="problem-text-submit">${output}</div>
            <div class="headline"><h2>예시입력</h2></div>
            <div class="problem-text-submit"><pre class="sampledata" >${samplein}</pre></div>
            <div class="headline"><h2>예제출력</h2></div>
            <div class="problem-text-submit"><pre class="sampledata" >${sampleout}</pre></div>
    `;
    } else {
      window.location.href = `https://www.acmicpc.net/problem/${num}`;
    }
  }

  function inputPush() {
    const container = document.querySelector(".form-horizontal");
    const optional_input = document.createElement("div");

    optional_input.classList.add("optional_input");
    container.appendChild(optional_input);
    input_example.forEach((element, index) => {
      const optional_input_button = document.createElement("div");
      optional_input.appendChild(optional_input_button);
      optional_input_button.classList.add("optional_input_button" + index);
      optional_input_button.innerHTML = `${element}`;
      document
        .querySelector(".optional_input_button" + index)
        .addEventListener("click", () => {
          document
            .querySelector(".optional_input")
            .parentElement.removeChild(optional_input);
          document.querySelector(".codemirror-textarea").value =
            "Valuethis hahahaah";
          console.log(document.querySelector(".codemirror-textarea").value);
          // .classList.add("ababdd");
        });
    });
  }

  inputPush();
})();
