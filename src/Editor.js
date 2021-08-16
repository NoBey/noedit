import keycode from "./keycode";

class Text {
  constructor(text = "") {
    this.node = document.createTextNode(text);
  }
  isText() {
    return true;
  }
}

class Paragraph {
  child = [];
  constructor(text) {
    this.el = document.createElement("p");
    if (text) {
      this.child.push(new Text());
    }
  }
}

// class Model{
//   child = []
//   constructor(){
//     this.child.push(new Paragraph)
//   }

// }

function render(model = [], container) {
  for (let i = 0; i < model.length; i++) {
    model[i];
    if (container) {
      container.appendChild(model[i].el || model[i].node);
    }
  }
}


class Selection {
  selection = window.getSelection()
  range = null
  
  constructor(){
    document.addEventListener('selectionchange', this.selectionchange.bind(this))
  }

  selectionchange(){
   const selection = window.getSelection()
   const range = selection.getRangeAt(0)
   this.range = range
   this.selection = selection
  }
}

const selection = new Selection()

// function in

class Editor {
  model = [];

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

    this.model.push(new Paragraph());
    this.init();

    render(this.model, this.el)

  }

  init() {
    const { el } = this;
    el.addEventListener("keydown", this.onkeydown.bind(this), false);
    el.addEventListener("keypress", this.onkeypress.bind(this));
    el.addEventListener("keyup", this.onkeyup.bind(this));
    el.addEventListener("input", this.oninput.bind(this));
    el.addEventListener("beforeinput", this.beforeinput.bind(this));
  }

  beforeinput(event) {
    // console.log("beforeinput", event, event.isComposing);
  }

  onkeydown(event) {
    event.stopPropagation();
    // console.log("onkeydown", String.fromCharCode(event.keyCode), event.keyCode);
    // event.preventDefault()
  }

  onkeypress(event) {
    // console.log(
    //   "onkeypress",
    //   String.fromCharCode(event.keyCode),
    //   event.keyCode
    // );
    event.preventDefault();
  }

  onkeyup(event) {
    // console.log("onkeyup", String.fromCharCode(event.keyCode), event.keyCode);
    console.log(window.getSelection().getRangeAt(0));
  }

  oninput(event) {
    // console.log("oninput", event);
  }
}

export default Editor;
