import './index.css'

import Editor from './Editor'


const app = document.createElement('div')
app.id = 'app'
document.body.appendChild(app)

window.onload = () => {

   window.app =  new Editor(app)
   // window.app.el.innerHTML =  `
   // <h1>标题11</h1>
   // <h2>标题22</h2>
   // <h3>标题3</h3>
   // <p>阿花恢复肌肤健康反馈好呢</p>
   // `
}




// function createTextArea(){
//   const textarea =  document.createElement('span')
//   textarea.setAttribute("contenteditable", true);
//   textarea.focus()
//   return textarea
// }

// let textarea = createTextArea()
// window.textarea =textarea



// document.addEventListener('selectionchange', () => {
//    const selection = window.getSelection()
//    const range = selection.getRangeAt(0)
//    if(range.commonAncestorContainer === textarea) return
//    if(range.collapsed){
      
//       const rightText = range.startContainer.splitText(range.startOffset)
//       rightText.parentNode.insertBefore(textarea, rightText)
//       textarea.innerHTML = "\u200B" 
//       // r.setStart(textarea, 0);
//       // r.setEnd(textarea, 1);
//       let r = new Range();
//       // r.setStart(textarea.firstChild, 0);
//       // r.setEnd(textarea.firstChild, 1);
      
//       // r.setStartAfter(textarea.firstChild)
//       r.setStartAfter(textarea.firstChild)
//       // r.setEndAfter(textarea.firstChild)
//       selection.removeAllRanges()
//       selection.addRange(r)
//       // textarea.focus()
//       // console.log(rightText.insertBefore)
//       // rightText.insertBefore(createTextArea())   
//    }
   
//    console.log(selection, range);
//  });

// const btn = document.createElement('button')
//   btn.innerText = 'test'
//  document.body.appendChild(btn)

//  btn.onclick = () => {

//    let node = document.querySelector('span').firstChild
//    let r = new Range()
//    let s = window.getSelection()
//    r.setStartBefore(node)
//    r.setEndAfter(node)
//    s.removeAllRanges()
//    s.addRange(r)
   



//  }