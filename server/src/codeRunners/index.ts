import { compileAndRunCpp } from "./cppRunner";
import { compileAndRunCsharp } from "./csharpRunner";
import { nodeJsRunner } from "./nodejsRunner";
import { pythonRunner } from "./pythonRunner";

export async function codeRunner(language: string, code: string, testInput: string): Promise<string> {
    switch (language) {
        case "cpp":
            return await compileAndRunCpp(code, testInput);
        case "csharp":
            return await compileAndRunCsharp(code, testInput);
        case "nodejs":
            return await nodeJsRunner(code, testInput);
        case "python":
            return await pythonRunner(code, testInput);
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
}