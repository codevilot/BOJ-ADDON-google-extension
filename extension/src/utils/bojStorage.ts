import { path } from "./path";

class BOJStorage{
    public isValidPage(){
        const pathname = window.location.pathname;
        return /^\/(submit|problem)\/\d+$/.test(pathname);
    }
    public setItem(key:string, value:string){
        if(!this.isValidPage()) return
        return localStorage.setItem(key, value)
    }
    public getInitialCode(){
        return (this.isValidPage() 
            ? (this.getItem(path.getProblemPathByNumber())) 
            : this.getReviewSource()) ?? ""
    }
    public getReviewSource(){
        const sourceElement = document.getElementById("source")
        return sourceElement? sourceElement.textContent : ""
    }
    public getItem(key:string, ){
        if(!this.isValidPage()) return null
        return localStorage.getItem(key)
    }
}

export const bojStorage = new BOJStorage()