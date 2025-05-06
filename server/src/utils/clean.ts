import fs from "fs";
import os from "os";
import path from "path";
const SHOULD_REMOVE_TEMP: boolean = true;


export function removeTempDir(dirPath: string): void {
    if (!SHOULD_REMOVE_TEMP) return;
  
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch (_) {
      console.warn("failed to remove temp folder.")
      // 삭제 실패해도 무시
    }
  }
export function cleanupOldCsharpTempDirs() {
    const tempDir = os.tmpdir();
    const files = fs.readdirSync(tempDir);
  
    for (const file of files) {
      if (file.startsWith("csharp_project_")) {
        const filePath = path.join(tempDir, file);
        try {
          fs.rmSync(filePath, { recursive: true, force: true });
          console.log(`임시 폴더 삭제 완료: ${filePath}`);
        } catch (err) {
          console.error(`임시 폴더 삭제 실패: ${filePath}`, err);
        }
      }
    }
  }