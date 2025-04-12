import http from "http";
import { spawn, execSync } from "child_process";

let serverProcess: any;

const checkServerRunning = () => {
    return new Promise<boolean>((resolve) => {
        const req = http.request(
            {
                hostname: "localhost",
                port: 100,
                path: "/healthy",
                method: "GET",
            },
            (res) => {
                resolve(res.statusCode === 200);
            }
        );

        req.on("error", () => resolve(false));
        req.end();
    });
};

beforeAll(async () => {
    const isRunning = await checkServerRunning();

    if (!isRunning) {
        try {
            // 기존 프로세스 종료 (Mac/Linux 전용)
            execSync("lsof -ti :100 | xargs kill -9", { stdio: "ignore" });
        } catch {}

        // 서버 실행 (spawn 사용)
        serverProcess = spawn("ts-node", ["src/main.ts"], {
            stdio: ["ignore", "ignore", "pipe"], // stderr만 읽기
        });

        serverProcess.stderr.on("data", (data: Buffer) => {
            console.error("❌ 서버 오류:", data.toString());
        });

        // 서버 실행 대기
        await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
        console.log("✅ 서버가 이미 실행 중이므로 새 서버를 실행하지 않음.");
    }
});

afterAll(() => {
    if (serverProcess) {
        serverProcess.kill();
    }
});



const sendRequest = async (language: "python" | "cpp" | "nodejs" |"csharp", code: string, input: string[], expected: string[]) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ language, code, input, expected });

        const options = {
            hostname: "localhost",
            port: 100,
            path: "/run",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data),
            },
        };

        const req = http.request(options, (res) => {
            let responseData = "";

            res.on("data", (chunk) => {
                responseData += chunk;
            });

            res.on("end", () => {
                try {
                    resolve(JSON.parse(responseData));
                } catch (error) {
                    reject(new Error("❌ JSON 파싱 실패"));
                }
            });
        });

        req.on("error", (err) => {
            reject(new Error(`❌ 요청 실패: ${err.message}`));
        });

        req.write(data);
        req.end();
    });
};

describe("Code Execution API", () => {
    test("Python 코드 실행 테스트", async () => {
        const response = await sendRequest(
            "python",
            `a = int(input())\nb = int(input())\nprint(a + b)`,
            ["4\n6", "10\n10"],
            ["10", "20"]
        );
        expect(response).toEqual({results:[{"expected":"10", "input": "4\n6", "output": "10", "result": "정답"},{"expected": "20", "input": "10\n10", "output": "20", "result": "정답"}]});
    });

    test("Node.js 코드 실행 테스트", async () => {
        const response = await sendRequest(
            "nodejs",
            `const input = require('fs').readFileSync("/dev/stdin").toString().trim().split('\\n');
             const a = parseInt(input[0]);
             const b = parseInt(input[1]);
             console.log(a + b);`,
            ["4\n6", "10\n10"],
            ["10", "20"]
        );
        expect(response).toEqual({results:[{"expected":"10", "input": "4\n6", "output": "10", "result": "정답"},{"expected": "20", "input": "10\n10", "output": "20", "result": "정답"}]});
    });

    test("C++ 코드 실행 테스트", async () => {
        const response = await sendRequest(
            "cpp",
            `#include <iostream>
            using namespace std;
            int main() {
                int a, b;
                cin >> a >> b;
                cout << (a + b) << endl;
                return 0;
            }`,
            ["4\n6", "10\n10"],
            ["10", "20"]
        );
        expect(response).toEqual({results:[{"expected":"10", "input": "4\n6", "output": "10", "result": "정답"},{"expected": "20", "input": "10\n10", "output": "20", "result": "정답"}]});
    });
    test("C# 코드 실행 테스트", async () => {
        const response = await sendRequest(
          "csharp",
          `
      using System;
      
      public class Program {
          public static void Main(string[] args) {
              int a = int.Parse(Console.ReadLine());
              int b = int.Parse(Console.ReadLine());
              Console.WriteLine(a + b);
          }
      }
          `.trim(),
          ["4\n6", "10\n10"], // 입력들
          ["10", "20"]        // 기대하는 출력들
        );
      
        expect(response).toEqual({
          results: [
            { expected: "10", input: "4\n6", output: "10", result: "정답" },
            { expected: "20", input: "10\n10", output: "20", result: "정답" }
          ]
        });
      });
});

