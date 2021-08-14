import './index.css'

import Editor from './Editor'


const app = document.createElement('div')
app.id = 'app'
document.body.appendChild(app)

window.onload = () => {

   window.app =  new Editor(app)
   window.app.el.innerHTML =  `
   <h1>标题11</h1>
   <h2>标题22</h2>
   <h3>标题3</h3>
   <p>阿花恢复肌肤健康反馈好呢</p>
   `
}

function createTextArea(){
  const textarea =  document.createElement('span')
  textarea.setAttribute("contenteditable", true);
  textarea.focus()
  return textarea
}

let textarea = createTextArea()

document.addEventListener('selectionchange', () => {
   const selection = document.getSelection()
   const range = selection.getRangeAt(0)
   if(range.collapsed){
      
      const rightText = range.startContainer.splitText(range.startOffset)
      rightText.parentNode.insertBefore(textarea, rightText)
      textarea.innerHTML = "\u200B" 
      range.setStart(textarea, 0);
      range.setEnd(textarea, 1);
      // range.selectNode(t )
      selection.addRange(range)
      // textarea.focus()
      // console.log(rightText.insertBefore)
      // rightText.insertBefore(createTextArea())   
   }
   
   console.log(selection, range);
 });