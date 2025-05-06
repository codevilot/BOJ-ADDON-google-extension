import { spawn } from "child_process";
export async function pythonRunner(code: string, input: string): Promise<string> {
    return new Promise((resolve) => {

        const child = spawn("python", ["-c", code]);
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