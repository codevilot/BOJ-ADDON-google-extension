export const sampleExample = [
  { button: "입력값 없음", code: "" },
  {
    button: "input\n\n입력 값 1개",
    code: 'const input = require("fs").readFileSync("/dev/stdin").toString().trim();',
  },
  {
    button: "arr[0], arr[1], ...arr[n]\n\n빈칸을 두고 값 정렬",
    code: 'const arr = require("fs").readFileSync("/dev/stdin").toString().trim().split(" ");',
  },

  {
    button: "arr[0]\narr[1]\n...\narr[n]\n\n각 줄에 값 정렬",
    code: 'const arr = require("fs").readFileSync("/dev/stdin").toString().trim().split("\\n");',
  },
  {
    button:
      "N\narr[0], arr[1], ...arr[n]\n\n첫째 줄에 N, 두 번째 줄에 값 정렬\n",
    code: 'const [n, ...arr] = require("fs").readFileSync("/dev/stdin").toString().trim().split("/\\s/");',
  },
  {
    button:
      "N\narr[0]\narr[1]\n...\narr[n]\n\n첫째 줄에 N, 두 번째줄부터 값 정렬\n",
    code: 'const [n, ...arr] = require("fs").readFileSync("/dev/stdin").toString().trim().split("\\n");',
  },
];
