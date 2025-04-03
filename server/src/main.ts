#!/usr/bin/env node
import { createServer, IncomingMessage, ServerResponse } from "http";
import { exec, spawn } from "child_process";
import fs from "fs";

const PORT = 100;

interface RequestBody {
    language: "python" | "cpp" | "nodejs";
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
};

// 실행 파일이 설치되어 있는지 확인
async function isExecutableInstalled(command: string): Promise<boolean> {
    return new Promise((resolve) => {
        exec(`which ${command}`, (error, stdout) => {
            resolve(Boolean(stdout.trim()) && !error);
        });
    });
}

// C++ 코드 컴파일 및 실행
async function compileAndRunCpp(code: string, input: string): Promise<string> {
    return new Promise((resolve) => {
        const execFileName = `/tmp/cpp_exec_${Date.now()}`;
        const compileProcess = spawn("g++", ["-x", "c++", "-", "-o", execFileName]);

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
                resolve(output.trim());
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

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === "GET" && req.url === "/healthy") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "OK", supported_language: ["python", "cpp", "nodejs"] }));
        return;
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
                        } else {
                            output = await runScript(language, code, testInput);
                        }

                        return {
                            input: testInput,
                            output,
                            expected: expected[index],
                            result: output === expected[index] ? "정답" : "오답",
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

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
