(function () {
  const addressKey = window.location.href.split("/").slice(-2);
  const num = addressKey[1];
  let bool = localStorage.getItem(`${num}`);
  if (addressKey[0] === "problem") {
    if (bool === "true") {
      window.location.href = `https://www.acmicpc.net/submit/${num}`;
    } else {
      const num = addressKey[1];
      const desc = document.querySelector("#problem_description").innerHTML;
      const input = document.querySelector("#problem_input").innerHTML;
      const output = document.querySelector("#problem_output").innerHTML;
      const samplein = document
        .querySelector("#sample-input-1")
        .innerHTML.trim();
      const sampleout = document.querySelector("#sample-output-1").innerHTML;
      localStorage.setItem(`${num}`, "true");
      localStorage.setItem(`${num}_desc`, desc);
      localStorage.setItem(`${num}_input`, input);
      localStorage.setItem(`${num}_output`, output);
      localStorage.setItem(`${num}_samplein`, samplein);
      localStorage.setItem(`${num}_sampleout`, sampleout);
      bool = localStorage.getItem(`${num}`);
      if (bool === "true") {
        window.location.href = `https://www.acmicpc.net/submit/${num}`;
      }
    }
  }
})();
