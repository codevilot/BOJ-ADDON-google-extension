#!/usr/bin/env node
import { createServer, IncomingMessage, ServerResponse } from "http";
import { get as httpsGet } from "https";
import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { load } from "cheerio";
import { removeTempDir } from "./utils/clean";
import { platform } from "os";
import packageJson from '../package.json';
const PORT = 100;

interface RequestBody {
    language: "python" | "cpp" | "nodejs" | "csharp";
    code: string;
    input: string[];
    expected: string[];
}

interface Result {
    input: string;
    output: string;
    expected: string;
    result: "정답" | "오답";
}

const executableMap: Record<string, string> = {
    python: "python3",
    cpp: "g++",
    nodejs: "node",
    csharp: "dotnet"
};

// 실행 파일이 설치되어 있는지 확인
async function isExecutableInstalled(command: string): Promise<boolean> {
  const cmd = platform() === "win32" ? `where ${command}` : `which ${command}`;
  return new Promise((resolve) => {
      exec(cmd, (error, stdout) => {
          console.error(error);
          resolve(Boolean(stdout.trim()) && !error);
      });
  });
}

// C++ 코드 컴파일 및 실행
async function compileAndRunCpp(code: string, input: string): Promise<string> {
    return new Promise((resolve) => {
        const execFileName = `/tmp/cpp_exec_${Date.now()}`;
        const compileProcess = spawn("g++", ["-std=c++17", "-x", "c++", "-", "-o", execFileName]);

        compileProcess.stdin.write(code);
        compileProcess.stdin.end();

        let compileError = "";

        compileProcess.stderr.on("data", (data) => (compileError += data.toString()));

        compileProcess.on("close", (exitCode) => {
            if (exitCode !== 0) {
                resolve(compileError);
                return;
            }

            const executeProcess = spawn(execFileName);
            executeProcess.stdin.write(input + "\n");
            executeProcess.stdin.end();

            let output = "";
            const timeout = setTimeout(() => {
                executeProcess.kill();
                resolve("시간 초과");
            }, 3000);

            executeProcess.stdout.on("data", (data) => (output += data.toString()));
            executeProcess.stderr.on("data", (data) => (output += data.toString()));

            executeProcess.on("close", () => {
                clearTimeout(timeout);
                fs.unlink(execFileName, () => {});
                resolve(output.trimEnd());
            });
        });
    });
}

// Python, Node.js 코드 실행
async function runScript(language: string, code: string, input: string): Promise<string> {
    return new Promise((resolve) => {
        const runCmd = executableMap[language];
        const args = language === "python" ? ["-c", code] : ["-e", code];

        const child = spawn(runCmd, args);
        child.stdin?.write(input + "\n");
        child.stdin?.end();

        let output = "";
        const timeout = setTimeout(() => {
            child.kill();
            resolve("시간 초과");
        }, 3000);

        child.stdout?.on("data", (data) => (output += data.toString()));
        child.stderr?.on("data", (data) => (output += data.toString()));

        child.on("close", () => {
            clearTimeout(timeout);
            resolve(output.trim());
        });
    });
}
// C# 컴파일 및 실행 함수 추가
export async function compileAndRunCsharp(
  code: string,
  input: string
): Promise<string> {
  return new Promise((resolve) => {
    const timestamp: number = Date.now();
    const tempDir: string = path.join(os.tmpdir(), `csharp_project_${timestamp}`);

    try {
      fs.mkdirSync(tempDir, { recursive: true });

      const init = spawn("dotnet", ["new", "console", "--force"], { cwd: tempDir });

      init.on("close", (codeInit: number | null) => {
        if (codeInit !== 0) {
          resolve("프로젝트 생성 실패");
          return;
        }

        const programPath: string = path.join(tempDir, "Program.cs");
        fs.writeFileSync(programPath, code);

        const build = spawn("dotnet", ["build"], { cwd: tempDir });

        build.on("close", (codeBuild: number | null) => {
          if (codeBuild !== 0) {
            resolve("빌드 실패");
            return;
          }

          const run = spawn("dotnet", ["run", "--no-build"], { cwd: tempDir });

          run.stdin.write(input + "\n");
          run.stdin.end();

          let output: string = "";

          const timeout = setTimeout(() => {
            run.kill();
            removeTempDir(tempDir);
            resolve("시간 초과");
          }, 5000);

          run.stdout.on("data", (data: Buffer) => {
            output += data.toString();
          });

          run.stderr.on("data", (data: Buffer) => {
            output += data.toString();
          });

          run.on("close", () => {
            clearTimeout(timeout);
            removeTempDir(tempDir);
            resolve(output.trim());
          });
        });
      });

    } catch (error) {
      removeTempDir(tempDir);
      const errorMessage: string = (error instanceof Error) ? error.message : "알 수 없는 오류";
      resolve("오류 발생: " + errorMessage);
    }
  });
}
  
  
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === "GET") {
        if(req.url === "/healthy"){
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "OK", supported_language: ["python", "cpp", "nodejs", "csharp"] }));
            return;
        }
        const match = req?.url?.match(/^\/problem\/(\d+)$/);
        if (match) {
            const problemId = match[1];
            const targetUrl = `https://www.acmicpc.net/problem/${problemId}`;          
            const options = {
              headers: {"User-Agent":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",},
            };
          
            httpsGet(targetUrl, options, (acmicpcRes) => {
                let data = "";
          
                acmicpcRes.on("data", (chunk) => {
                  data += chunk;
                });
          
                acmicpcRes.on("end", () => {
                    const $ = load(data);
                
                    // 전체 row 요소 가져오기
                    const $row = $(".container.content > .row");
                
                    // page-header를 포함한 col-md-12 요소 찾기
                    const $start = $row.find(".col-md-12:has(.page-header)").first();
                
                    if ($start.length) {
                      // 이 col-md-12부터 뒤의 형제 요소들까지를 포함해서 새 HTML 조각 만들기
                      const $result = $("<div></div>");
                      let $current = $start;
                
                      while ($current.length) {
                        $result.append($current.clone());
                        $current = $current.next();
                      }
                
                      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                      res.end($result.html());
                    } else {
                      res.writeHead(404, { "Content-Type": "text/plain" });
                      res.end("요소를 찾을 수 없습니다.");
                    }
                  });
              })
              .on("error", (err) => {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end(err.toString());
              });
          
            return;
        }
    }

    if (req.method === "POST" && req.url === "/run") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            try {

                const { language, code, input, expected }: RequestBody = JSON.parse(body);
                if (!Object.keys(executableMap).includes(language)) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify([{ error: "Supported languages: python, cpp, nodejs" }]));
                    return;
                }

                if (!Array.isArray(input) || !Array.isArray(expected) || input.length !== expected.length) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify([{ error: "Invalid input or expected output format" }]));
                    return;
                }

                const isInstalled = await isExecutableInstalled(executableMap[language]);
                if (!isInstalled) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify([{ error: `${executableMap[language]} 실행 파일이 설치되지 않았습니다.` }]));
                    return;
                }

                const results: Result[] = await Promise.all(
                    input.map(async (testInput, index) => {
                        let output = "";
                        if (language === "cpp") {
                            output = await compileAndRunCpp(code, testInput);
                        } else if (language === "csharp") {
                            output = await compileAndRunCsharp(code, testInput);
                        } else {
                            output = await runScript(language, code, testInput);
                        }
                        const expectedValue =  expected[index].trimEnd()
                        return {
                            input: testInput,
                            output,
                            expected: expectedValue,
                            result: output.trimEnd() === expectedValue ? "정답" : "오답",
                        };
                    })
                );

                res.writeHead(200, { "Content-Type": "application/json" });
                console.log({ results })
                res.end(JSON.stringify({ results }));
            } catch (error) {
                console.error("❌ 요청 처리 중 오류 발생:", error);
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify([{ error: "Invalid JSON format" }]));
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify([{ error: "Not Found" }]));
    }
});
export function cleanupOldCsharpTempDirs() {
    const tempDir = os.tmpdir();
    const files = fs.readdirSync(tempDir);
  
    for (const file of files) {
      if (file.startsWith("csharp_project_")) {
        const filePath = path.join(tempDir, file);
        try {
          fs.rmSync(filePath, { recursive: true, force: true });
          console.log(`임시 폴더 삭제 완료: ${filePath}`);
        } catch (err) {
          console.error(`임시 폴더 삭제 실패: ${filePath}`, err);
        }
      }
    }
  }
server.listen(PORT, () => {
    cleanupOldCsharpTempDirs()
    console.log(`🚀 BOJ Server ${packageJson.version} running on port ${PORT}`)
});
