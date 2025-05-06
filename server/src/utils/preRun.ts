import { exec } from "child_process";
import { platform } from "os";

class PreRun{
    public isExecutableInstalled(command: string){
        const cmd = platform() === "win32" ? `where ${command}` : `which ${command}`;
        return new Promise((resolve) => {
            exec(cmd, (error, stdout) => {
                console.error(error);
                resolve(Boolean(stdout.trim()) && !error);
            });
        });
    }
    public getGRecaptchaCode(){
        return `const siteKey = "6Le_rx4rAAAAAATDXRag3GgpO641c5wodH30zQh1";
            if (typeof window.grecaptcha !== 'undefined' && typeof window.grecaptcha.enterprise !== 'undefined') {
              window.grecaptcha.enterprise.execute(siteKey, { action: 'submit' })
            } else {
              console.warn('grecaptcha가 아직 로드되지 않았습니다. 500ms 후에 다시 시도합니다.');
              setTimeout(function() {
                executeRecaptcha(siteKey);
              }, 500);
            }`
    }
}


export const preRun = new PreRun()