// import 'regenerator-runtime/runtime'
import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import "./index.less";
import { Edit, Root } from "./view";
// import { editor } from "./editor";
// import { Menu } from './component';
import { Editor } from "./editor";
// .lexer('> I am using marked.')

export function App() {
  console.log('App')
  // const [model, setModel] = useState(editor.model._model);
  useEffect(() => {
    // editor.model.onChange(() => setModel({ ...editor.model._model }));
  }, []);
  return <Edit editor={new Editor}>
    <Root />
  </Edit>
}




// const root = document.createElement('div');
// document.body.appendChild(root)
// ReactDOM.render(<App />, root);
