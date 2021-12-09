import React, { useEffect, useState } from "react";
import "./index.css";
import { Root } from "./view";
import { editor } from "./editor";
import { selection } from "./selection";
// .lexer('> I am using marked.')

export default function App() {
  const [model, setModel] = useState(editor.model);
  useEffect(() => {
    editor.onModelChange(() => setModel({ ...editor.model }));
  }, []);
  return <Root {...model} />;
}
