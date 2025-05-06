import { IncomingMessage, ServerResponse } from "http";
import { executableMap } from "../constant";
import { RequestBody, Result } from "../types";
import { preRun } from "../utils/preRun";
import { codeRunner } from "../codeRunners";

export function postHandler(req: IncomingMessage, res: ServerResponse){
    if(req.url === "/run"){
        let body = "";

        req.on("data", (chunk) => { body += chunk.toString(); });

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

                const isInstalled = await preRun.isExecutableInstalled(executableMap[language]);
                if (!isInstalled) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify([{ error: `${executableMap[language]} 실행 파일이 설치되지 않았습니다.` }]));
                    return;
                }

                const results: Result[] = await Promise.all(
                    input.map(async (testInput, index) => {
                      const output = await codeRunner(language, code, testInput);
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
}