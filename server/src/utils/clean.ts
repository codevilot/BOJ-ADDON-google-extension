const SHOULD_REMOVE_TEMP: boolean = false;
import fs from "fs";
export function removeTempDir(dirPath: string): void {
    if (!SHOULD_REMOVE_TEMP) return;
  
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch (_) {
      console.warn("failed to remove temp folder.")
      // 삭제 실패해도 무시
    }
  }