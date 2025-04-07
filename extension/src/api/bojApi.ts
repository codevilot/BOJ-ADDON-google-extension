export class BOJApi{

    public async run(data:string){
        try {
            const result = await fetch("http://localhost:100/run", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: data,
            });
        
            const responseData = await result.json();
        
            if (!result.ok) throw JSON.stringify(responseData);
            return responseData;
          } catch(e){
            throw new Error(`${e}`);
        }
    }
    public async health(){
        try{
            const result = await fetch("http://localhost:100/healthy")
            const supportedLang = await result.json()
            return {connected:true, supportedLang:supportedLang["supported_language"]}
        }catch(e){
            console.log(e)
            return {connected:false, supportedLang:[]}
        } 
    }
    public async problem(problemNumber:string){
        try{
            const result = await fetch(`http://localhost:100/problem/${problemNumber}`)
            return await result.text()
        }catch(e){
            throw new Error(`${e}`);
        } 
    }
}

export const bojApi = new BOJApi()