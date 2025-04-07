export const sampleCode = {
    nodejs: [
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
        button: "N\narr[0], arr[1], ...arr[n]\n\n첫째 줄에 N, 두 번째 줄에 값 정렬",
        code: 'const [n, ...arr] = require("fs").readFileSync("/dev/stdin").toString().trim().split(/\\s/);',
      },
      {
        button: "N\narr[0]\narr[1]\n...\narr[n]\n\n첫째 줄에 N, 두 번째줄부터 값 정렬",
        code: 'const [n, ...arr] = require("fs").readFileSync("/dev/stdin").toString().trim().split("\\n");',
      },
    ],
    python: [
      { button: "입력값 없음", code: "" },
      {
        button: "input\n\n입력 값 1개",
        code: 'N = input()',
      },
      {
        button: "arr[0], arr[1], ...arr[n]\n\n빈칸을 두고 정수 정렬",
        code: 'import sys\narr = list(map(int, sys.stdin.readline().split()))',
      },
      {
        button: "N값만큼 N줄에 1개씩 값 입력",
        code: 'N = int(input())\nM = [int(input()) for _ in range(N)]',
      },
      {
        button: "N\narr[0], arr[1], ...arr[n]\n\n첫째 줄에 N, 두 번째 줄에 값 정렬",
        code: 'import sys\nN, *arr = map(int, sys.stdin.read().split())',
      },
      {
        button: "N\narr[0]\narr[1]\n...\narr[n]\n\n첫째 줄에 N, 두 번째줄부터 값 정렬",
        code: 'import sys\nN, *arr = map(int, sys.stdin.read().splitlines())',
      },
    ],
    cpp: [
      { button: "입력값 없음", code: "" },
      {
        button: "입력 값 1개",
        code: '#include <iostream>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    cout << s;\n    return 0;\n}',
      },
      {
        button: "arr[0], arr[1], ...arr[n]\n\n빈칸을 두고 정수 정렬",
        code: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> arr;\n    int x;\n    while (cin >> x) arr.push_back(x);\n}',
      },
      {
        button: "N\narr[0]\narr[1]\n...\narr[n]\n\n첫째 줄에 N, 두 번째줄부터 값 정렬",
        code: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int N;\n    cin >> N;\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) cin >> arr[i];\n}',
      },
    ],
    csharp: [
      { button: "입력값 없음", code: "" },
      {
        button: "input\n\n입력 값 1개",
        code: 'using System;\nclass Program {\n    static void Main() {\n        string input = Console.ReadLine();\n        Console.WriteLine(input);\n    }\n}',
      },
      {
        button: "arr[0], arr[1], ...arr[n]\n\n빈칸을 두고 값 정렬",
        code: 'using System;\nusing System.Linq;\nclass Program {\n    static void Main() {\n        int[] arr = Console.ReadLine().Split().Select(int.Parse).ToArray();\n    }\n}',
      },
      {
        button: "arr[0]\narr[1]\n...\narr[n]\n\n각 줄에 값 정렬",
        code: 'using System;\nusing System.Collections.Generic;\nclass Program {\n    static void Main() {\n        var arr = new List<string>();\n        string line;\n        while ((line = Console.ReadLine()) != null && line != "") {\n            arr.Add(line);\n        }\n    }\n}',
      },
      {
        button: "N\narr[0], arr[1], ...arr[n]\n\n첫째 줄에 N, 두 번째 줄에 값 정렬",
        code: 'using System;\nusing System.Linq;\nclass Program {\n    static void Main() {\n        int n = int.Parse(Console.ReadLine());\n        int[] arr = Console.ReadLine().Split().Select(int.Parse).ToArray();\n    }\n}',
      },
      {
        button: "N\narr[0]\narr[1]\n...\narr[n]\n\n첫째 줄에 N, 두 번째줄부터 값 정렬",
        code: 'using System;\nclass Program {\n    static void Main() {\n        int n = int.Parse(Console.ReadLine());\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) {\n            arr[i] = int.Parse(Console.ReadLine());\n        }\n    }\n}',
      },
    ],
  };
  