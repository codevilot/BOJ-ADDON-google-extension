import { SupportedLang } from "../types/types";

export const isSupportedLang = (value: string|null): value is SupportedLang => {
    return ["nodejs", "python", "cpp"].includes(value||'');
};
