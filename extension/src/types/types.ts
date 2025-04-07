export type SupportedLang = "nodejs" | "python" | "cpp" | "csharp";
export type Result = { message?: string; error?: string; input?: string, output?:string, expected?:string};
export type TestCode = { input:string, output:string};