import './index.css'

import Editor from './Editor'


const app = document.createElement('div')
app.id = 'app'
document.body.appendChild(app)

window.onload = () => {

   window.app =  new Editor(app)

}