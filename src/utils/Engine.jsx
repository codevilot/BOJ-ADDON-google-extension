const iframe = document.createElement("iframe");
document.body.append(iframe);
iframe.style.display = "none";
iframe.srcdoc = `
<!DOCTYPE html>
<html lang="ko-KR">
  <head>
    <meta charset="UTF-8" />
    <script>
    let console_stack = "";
    let message = []
    console.log = function (...args) {
      console_stack = console_stack +
        (console_stack === '' ? '' : '\\n') +
        [...args].map(arg=>
          arg instanceof Set ||
            arg instanceof Map ? JSON.stringify([...arg]) :
            arg instanceof Array || 
            arg instanceof Object? JSON.stringify(arg):
            arg
          ).join(' ');

    };

    const runCode = (input, output,code, i) =>{

      console_stack =""
      require = function(fs){
        process = {
          platform :"linux"
        };
        return {readFileSync : function(){ return input}}
      };
      
      new Function(code)()
      const isCorrect = (console_stack.trim()===output.trim())
      message.push({input, output, result:console_stack})
    }

    window.addEventListener('message', ({data})=>{
      const {code,input,output} = JSON.parse(data)
      message=[]
      input.forEach((item,index) => runCode(input[index], output[index], code, index))
      window.parent.postMessage(JSON.stringify(message), '*' );
    });

    </script>
    </head>
  <body>

  </body>
</html>  
`;
export const Engine = iframe;
