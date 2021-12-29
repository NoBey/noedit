import React, {
  useLayoutEffect,
  useRef,
  KeyboardEvent,
  useEffect,
  ReactNode,
  useState
} from "react";
// import { editor } from "../editor";
// import ReactPrismEditor from "react-prism-editor";
import { InlineText } from "./inline";
import { Code } from "./Code";
import { Hr } from "./Hr";
import { List, ListItem } from "./List";
import { Heading } from "./Heading";
import { Blockquote } from "./Blockquote";
import { Table } from "./Table";
import { Paragraph, TextBlock } from "./Paragraph";
import { EditorInterface } from "../editor";
import { EditorContext, useEditor } from "../hooks/useEditor";

export { InlineText };
// export let path = [];


const BlockComponentMap = {
  hr: Hr,
  paragraph: Paragraph,
  list: List,
  list_item: ListItem,
  heading: Heading,
  blockquote: Blockquote,
  space: () => <></>,
  text: TextBlock,
  code: Code,
  table: Table,
};

// export const idToDom = new Map();
// export const DomToBlock = new WeakMap();

// @ts-ignore
// window.idToDom = idToDom;
// @ts-ignore
// window.DomToBlock = DomToBlock;

 
export function Edit({ editor, children }: { children: ReactNode, editor: EditorInterface }) {
  return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
}


export function Root() {
  const editor = useEditor()
  const [model, setModel] = useState(editor.model._model)
  useEffect(() => {
    editor.model.onChange(() => setModel({ ...editor.model._model }));
  }, [])
  
  const { id, blocks } = model

  const ref = useRef<HTMLDivElement>();
  useLayoutEffect(() => {
    ref.current.addEventListener("beforeinput", editor.onBeforeInput);
    ref.current.addEventListener("paste", editor.onPaste);
    ref.current.addEventListener("compositionstart", editor.onCompositionstart);
    ref.current.addEventListener(
      "compositionupdate",
      editor.onCompositionupdate
    );
    ref.current.addEventListener("compositionend", editor.onCompositionend);

    editor.idToDom.set(id, ref.current);
    editor.DomToBlock.set(ref.current, editor.idToBlock.get(id));

    return () => {
      editor.idToDom.get(id).removeEventListener("beforeinput", editor.onBeforeInput);
      editor.DomToBlock.delete(editor.idToDom.get(id));
      editor.idToDom.delete(id);
    };
  }, [id]);
  // useEffect(() => {
  //   console.log('useEffect',  document.querySelector('h1').innerText)
  // })
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey && event.key === "z") {
      editor.history.undo();
    }
  };

  editor.textPath.length = 0;
  // console.log({blocks})
  return (
    <div
      id="root"
      ref={ref}
      contentEditable
      suppressContentEditableWarning={true}
      spellCheck={false}
      onKeyDown={onKeyDown}
    >
      <BlockList blocks={blocks} />
    </div>
  );
}

export function Block(props) {
  const editor = useEditor()
  const BlockComponent = (BlockComponentMap[props.type]);
  const ref = useRef<HTMLBaseElement>();
  useLayoutEffect(() => {
    if (ref.current) {
      editor.idToDom.set(props.id, ref.current);
      editor.DomToBlock.set(ref.current, editor.idToBlock.get(props.id));
      ref.current.dataset["type"] = props.type;
      ref.current.dataset["id"] = props.id;
    }
    return () => {
      editor.DomToBlock.delete(editor.idToDom.get(props.id));
      editor.idToDom.delete(props.id);
    };
  }, [props.id]);
  return <BlockComponent ref={ref} {...props} />;
}


export function BlockList({ blocks = [] }) {
  return (
    <>
      {blocks.map((block) => (
        <Block key={block.id} {...block} />
      ))}
    </>
  );
}