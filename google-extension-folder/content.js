const addr = window.location.href.split("/")
const num = addr[addr.length - 1]
const condition = chrome.runtime.getURL(`/problems/${num}.json`)


const target = document.querySelectorAll(".col-md-12")[1]
const container = document.createElement('div')
target.classList.add("spread")
container.innerHTML = `
<div> </div>
hasdfjklasdfjlkasdjfl
as
df
asd
fas
df
asdf
`
container.classList.add("desc")
target.appendChild(container)
console.log(target)