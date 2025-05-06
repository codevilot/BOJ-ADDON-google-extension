#!/usr/bin/env node
import { createServer, IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import path from "path";
import os from "os";
import packageJson from '../package.json';
import { getHandler } from "./handlers/getHandler";
import { postHandler } from "./handlers/postHandler";
import { optionsHandler } from "./handlers/optionsHandler";
const PORT = 100;
  
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if(req.method ==="OPTIONS") return optionsHandler(req, res)
    if(req.method ==="GET") return getHandler(req, res)
    if(req.method ==="POST") return postHandler(req, res)
});
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
server.listen(PORT, () => {
    cleanupOldCsharpTempDirs()
    console.log(`🚀 BOJ Server ${packageJson.version} running on port ${PORT}`)
});
