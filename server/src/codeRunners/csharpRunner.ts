#!/usr/bin/env node
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { removeTempDir } from "../utils/clean";
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