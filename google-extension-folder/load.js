(function () {
    const addressKey = window.location.href.split("/").slice(-2)
    const num = addressKey[1]
    const bool = localStorage.getItem(`${num}`);
    if (addressKey[0] === "submit") {
        if (bool === "true") {
            const desc = localStorage.getItem(`${num}_desc`);
            const input = localStorage.getItem(`${num}_input`);
            const output = localStorage.getItem(`${num}_output`);
            const samplein = localStorage.getItem(`${num}_samplein`);
            const sampleout = localStorage.getItem(`${num}_sampleout`);
            const target = document.querySelectorAll(".col-md-12")[1]
            const container = document.createElement('div')
            target.classList.add("spread")
            container.classList.add("desc")
            target.appendChild(container)
            container.innerHTML = `
            <div class="headline"><h2>문제</h2></div>
            <div class="problem-text-submit">${desc}</div>
            <div class="headline"><h2>입력</h2></div>
            <div class="problem-text-submit">${input}</div>
            <div class="headline"><h2>출력</h2></div>
            <div class="problem-text-submit">${output}</div>
            <div class="headline"><h2>예시입력</h2></div>
            <div class="problem-text-submit"><pre class="sampledata" >${samplein}</pre></div>
            <div class="headline"><h2>예제출력</h2></div>
            <div class="problem-text-submit"><pre class="sampledata" >${sampleout}</pre></div>   
    `

        } else {
            window.location.href = `https://www.acmicpc.net/problem/${num}`
        }
    }

    function inputPush(str) {
        const container = document.querySelector("#submit_form")
        const position = container.querySelectorAll(".form-group")[2]
        const element = document.createElement("div")
        container.insertBefore(element, position)
        element.classList.add("form-group")
        element.innerHTML = `
        <label class="col-md-2 control-label" id="recommend">입력 추천</label>
        <pre class="col-md-10">${str}</pre>
        `
    }

})()

