import React, {
  useLayoutEffect,
  useRef,
  forwardRef,
  LegacyRef,
  KeyboardEvent,
  useEffect,
} from "react";
import { editor } from "../editor";
import { Block as BlockUtil } from "../block";
// import ReactPrismEditor from "react-prism-editor";
import { InlineText } from "./inline";
import { Code } from "./Code";
import { Hr } from "./Hr";
import { List, ListItem } from "./List";
import { Heading } from "./Heading";
import { Blockquote } from "./Blockquote";
import { Table } from "./Table";
import { Paragraph, TextBlock } from "./Paragraph";

export { InlineText };
export let path = [];


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

export const idToDom = new Map();
export const DomToBlock = new WeakMap();

// @ts-ignore
window.idToDom = idToDom;
// @ts-ignore
window.DomToBlock = DomToBlock;

export function Root({ blocks, id }) {
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

    idToDom.set(id, ref.current);
    DomToBlock.set(ref.current, editor.idToBlock.get(id));

    return () => {
      idToDom.get(id).removeEventListener("beforeinput", editor.onBeforeInput);
      DomToBlock.delete(idToDom.get(id));
      idToDom.delete(id);
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

  path.length = 0;

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
  const BlockComponent = BlockComponentMap[props.type];
  const ref = useRef<HTMLBaseElement>();
  useLayoutEffect(() => {
    if (ref.current) {
      idToDom.set(props.id, ref.current);
      DomToBlock.set(ref.current, editor.idToBlock.get(props.id));
      ref.current.dataset["type"] = props.type;
      ref.current.dataset["id"] = props.id;
    }
    return () => {
      DomToBlock.delete(idToDom.get(props.id));
      idToDom.delete(props.id);
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