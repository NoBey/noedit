import keycode from "./keycode";



class Editor {
  constructor(container) {
    this.el = document.createElement("div");
    this.el.style.width = "100%";
    this.el.style.height = "100%";
    this.el.style.outline = "none";
    this.el.style.flex = "1";
    this.el.style.overflowY = "scroll";

    this.el.setAttribute("contenteditable", true);
    this.el.setAttribute("spellcheck", false); 
    if (container) container.appendChild(this.el);
    this.init();
  }

  init() {
      const { el } = this
      el.addEventListener('keydown', this.onkeydown.bind(this))
      el.addEventListener('keypress', this.onkeypress.bind(this))
      el.addEventListener('keyup', this.onkeyup.bind(this))
      el.addEventListener('input', this.oninput.bind(this))
  }
  onkeydown(event){
      console.log('onkeydown',String.fromCharCode(event.keyCode),event.keyCode)
  }
  onkeypress(event){
    console.log('onkeypress',String.fromCharCode(event.keyCode), event.keyCode)
  }
onkeyup(event){
    console.log('onkeyup',String.fromCharCode(event.keyCode), event.keyCode)
}
oninput(event){
    console.log('oninput',event)
}

}

export default Editor;
