import { SupportedLang } from "../types/types";

export const isSupportedLang = (value: string|null): value is SupportedLang => {
    return ["nodejs", "python", "cpp", "csharp"].includes(value||'');
};
const langCodeMap: Record<SupportedLang, string> = {
    cpp: "84",
    python: "28",
    nodejs: "17",
    csharp: "86",
    rust: "94",
    java: "93",
  };
  
const codeLangMap = Object.fromEntries(
    Object.entries(langCodeMap).map(([lang, code]) => [code, lang])
) as Record<string, SupportedLang>;

export const getLangCode = (lang: string): string => {
    return langCodeMap[lang as SupportedLang] ?? "84";
};

export const getLangByCode = (code: string): SupportedLang => {
    return codeLangMap[code] ?? "nodejs";
};