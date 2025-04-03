let workerRunner = `
let console_stack = "";
let message = [];

process = { platform: "linux" };
console.log = function (...args) {
  console_stack =
    console_stack +
    (console_stack === "" ? "" : "\\n") +
    [...args]
      .map((arg) =>
        arg instanceof Set || arg instanceof Map
          ? JSON.stringify([...arg])
          : arg instanceof Array || arg instanceof Object
          ? JSON.stringify(arg)
          : arg
      )
      .join(" ");
};
const runCode = (input, expected, code, i) => {
  console_stack = "";
  require = function (fs) {
    process = {
      platform: "linux",
    };
    return {
      readFileSync: function () {
        return input;
      },
    };
  };
  
  new Function(code)();
  message.push({ input, expected, output: console_stack });
};
self.onmessage = ({ data }) => {
  const { code, input, expected, msgId } = JSON.parse(data);
  message = [];
  input.forEach((item, index) => runCode(input[index], expected[index], code, index));
  message.push(msgId)
  self.postMessage(JSON.stringify(message));
}; 
`;
const workerBlob = new Blob([workerRunner], { type: "text/javascript" });
const workerBlobUrl = URL.createObjectURL(workerBlob);

const createWorker = () => {
  const worker = new Worker(workerBlobUrl);
  return worker;
};

export const Engine = (function () {
  let worker = createWorker();
  return {
    get get() {
      return worker;
    },
    reset() {
      worker.terminate();
      worker = null;
      worker = createWorker();
    },
  };
})();
