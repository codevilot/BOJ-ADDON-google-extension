import { IncomingMessage, ServerResponse } from "http";
import { preRun } from "../utils/preRun";
import { get as httpsGet } from "https";
import { load } from "cheerio";
export function getHandler(req: IncomingMessage, res: ServerResponse){
    switch(req.url){
        case "/enterprise.js" :
            res.setHeader('Content-Type', 'application/javascript');
            res.end(preRun.getGRecaptchaCode());
            return;
        case "/healthy" :
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "OK", supported_language: ["python", "cpp", "nodejs", "csharp"] }));
            return;
        default :
            const match = req?.url?.match(/^\/problem\/(\d+)$/);
        if (match) {
            const problemId = match[1];
            const targetUrl = `https://www.acmicpc.net/problem/${problemId}`;          
            const options = {
              headers: {"User-Agent":"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",},
            };
          
            httpsGet(targetUrl, options, (acmicpcRes) => {
                let data = "";
          
                acmicpcRes.on("data", (chunk) => {
                  data += chunk;
                });
          
                acmicpcRes.on("end", () => {
                    const $ = load(data);
                
                    const $row = $(".container.content > .row");
                
                    const $start = $row.find(".col-md-12:has(.page-header)").first();
                
                    if ($start.length) {
                      const $result = $("<div></div>");
                      let $current = $start;
                
                      while ($current.length) {
                        $result.append($current.clone());
                        $current = $current.next();
                      }
                
                      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                      res.end($result.html());
                    } else {
                      res.writeHead(404, { "Content-Type": "text/plain" });
                      res.end("요소를 찾을 수 없습니다.");
                    }
                  });
              })
              .on("error", (err) => {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end(err.toString());
              });
          
            return;
        }
    }
}