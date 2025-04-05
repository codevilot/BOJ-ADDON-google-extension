class Path{
    problemId(){
        const pathname = window.location.pathname;
        const match = pathname.match(/(\d+)$/);
        return match ? match[1] : null;
    }
    getProblemPathByNumber(){
        return `/problem/${this.problemId()}`
    }
    getIsSubmitPage(){
        const pathname = window.location.pathname;
        const match = pathname.match(/\/submit\/(\d+)/);
        return !!match 
    }
    getIsLogin(){
        return document.querySelector(".loginbar.pull-right").innerText.includes("로그아웃")
    }
}

export const path = new Path()