// import 'regenerator-runtime/runtime'
import { App } from '@noedit/core'

import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";

// @ts-ignore
window.React1 = React
// @ts-ignore
window.ReactDOM1 = ReactDOM
// import "./index.less";
// import { Root } from "./view";
// import { editor } from "./editor";
// import { selection } from "./selection";
// import { Menu } from './component';
// // .lexer('> I am using marked.')

// export  function App() {
//   const [model, setModel] = useState(editor.model._model);
//   useEffect(() => {
//     editor.model.onChange(() => setModel({ ...editor.model._model }));
//   }, []);
//   return <>
//   <Root blocks={model.blocks}  id={model.id} />
//   </>
// }


const root = document.createElement('div');
document.body.appendChild(root)
console.log('render App')
ReactDOM.render(<App />, root);
