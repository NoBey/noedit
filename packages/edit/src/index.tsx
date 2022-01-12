// import 'regenerator-runtime/runtime'
import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import "./index.less";
import { Edit, Root } from "./view";
import { Editor } from "./editor";
import test from "./test1.md";


export { Editor, Edit, Root }


export function App() {
  const editor = new Editor({ md: `${test}` })
  // @ts-ignore 
  window.editor = editor
  return <Edit editor={editor}>
    <Root />
  </Edit>
}


// const root = document.createElement('div');
// document.body.appendChild(root)
// ReactDOM.render(<App />, root);
