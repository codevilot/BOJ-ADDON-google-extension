export interface RequestBody {
    language: "python" | "cpp" | "nodejs" | "csharp";
    code: string;
    input: string[];
    expected: string[];
}
  
export interface Result {
    input: string;
    output: string;
    expected: string;
    result: "정답" | "오답";
}