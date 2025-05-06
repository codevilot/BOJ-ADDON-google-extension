#!/usr/bin/env node
import { spawn } from "child_process";
import fs from "fs";
export async function compileAndRunCpp(code: string, input: string): Promise<string> {
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