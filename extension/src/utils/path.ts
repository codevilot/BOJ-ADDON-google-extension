class Path{
    public problemId(){
        const pathname = window.location.pathname;
        const match = pathname.match(/(\d+)$/);
        return match ? match[1] : null;
    }
    public getProblemPathByNumber(){
        return `/problem/${this.problemId()}`
    }
    public getIsProblemPage(){
        const pathname = window.location.pathname;
        const match = pathname.match(/\/problem\/(\d+)/);
        return !!match 
    }
    public getIsSubmitPage(){
        const pathname = window.location.pathname;
        const match = pathname.match(/\/submit\/(\d+)/);
        return !!match 
    }
    public getIsLogin(){
        return document.querySelector(".loginbar.pull-right")?.textContent?.includes("로그아웃")
    }
}

export const path = new Path()