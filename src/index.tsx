import 'regenerator-runtime/runtime'
import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import "./index.less";
import { Root } from "./view";
import { editor } from "./editor";
import { selection } from "./selection";
// .lexer('> I am using marked.')

export  function App() {
  const [model, setModel] = useState(editor.model._model);
  useEffect(() => {
    editor.model.onChange(() => setModel({ ...editor.model._model }));
  }, []);
  return <Root blocks={model.blocks}  id={model.id} />;
}


const root = document.createElement('div');
document.body.appendChild(root)
ReactDOM.render(<App />, root);
