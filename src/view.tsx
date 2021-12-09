import React, { useLayoutEffect, useRef, Fragment, forwardRef, LegacyRef } from "react";
import { idToBlock } from "./editor";
import { editor } from "./editor";

export const Blockquote = forwardRef(({ blocks }: any, ref: LegacyRef<HTMLElement>) => {
  return (
    <blockquote ref={ref}>
      <BlockList blocks={blocks} />
    </blockquote>
  );
});

export let path = [];

export const InlineText = ({ text, id }) => {
  path.push(id);
  return <>{text || <br />}</>;
};

export const Heading = forwardRef(({ text, depth, id }: any, ref: any) => {
  const H = "h" + depth;
  return (
   // @ts-ignore
    <H ref={ref}>
      <InlineText text={text} id={id} />
    </H>
  );
});

export const List = forwardRef(({ blocks }: any, ref: LegacyRef<HTMLUListElement>) => {
  return (
    <ul ref={ref}>
      <BlockList blocks={blocks} />
    </ul>
  );
});

export const ListItem = forwardRef(({ blocks }: any, ref: LegacyRef<HTMLLIElement>) => {
  return (
    <li ref={ref}>
      <BlockList blocks={blocks} />
    </li>
  );
});

export const Paragraph = forwardRef(({ text, id }: any, ref :LegacyRef<HTMLParagraphElement>) => {
  return (
    <p ref={ref}>
      <InlineText text={text} id={id} />
    </p>
  );
});

export const TextBlock = forwardRef(({ text, id }: any, ref: LegacyRef<HTMLParagraphElement>) => {
  return (
    <p ref={ref}>
      <InlineText text={text} id={id} />
    </p>
  );
});

const BlockComponentMap = {
  hr: Hr,
  paragraph: Paragraph,
  list: List,
  list_item: ListItem,
  heading: Heading,
  blockquote: Blockquote,
  space: () => <></>,
  text: TextBlock
};

export const idToDom = new Map();
export const DomToBlock = new WeakMap();
// @ts-ignore
window.idToDom = idToDom;
// @ts-ignore
window.DomToBlock = DomToBlock;

export function BlockList({ blocks = [] }) {
  return (
    <>
      {blocks.map((block) => (
        <Block key={block.id} {...block} />
      ))}
    </>
  );
}

export function Root({ blocks, id }) {
  const ref = useRef<HTMLDivElement>();
  useLayoutEffect(() => {
    function onBeforeInput(e) {
      console.log(e.inputType, e);
      // console.log(e.getTargetRanges());
      if (e.inputType === "deleteContentBackward") {
        editor.deleteContentBackward();
      }
      if (e.inputType === "insertText") {
        editor.insertText(e);
      }
      if (e.inputType === "insertParagraph") {
        editor.insertParagraph(e);
      }

      e.preventDefault();
    }
    ref.current.addEventListener("beforeinput", onBeforeInput);

    idToDom.set(id, ref.current);
    DomToBlock.set(ref.current, idToBlock[id]);

    return () => {
      idToDom.get(id).removeEventListener("beforeinput", onBeforeInput);
      DomToBlock.delete(idToDom.get(id));
      idToDom.delete(id);
    };
  }, [id]);

  path.length = 0;

  return (
    <div
      id="root"
      ref={ref}
      contentEditable
      suppressContentEditableWarning={true}
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
      DomToBlock.set(ref.current, idToBlock[props.id]);
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

export function Hr() {
  return (
    <div className="md-hr">
      <hr />
    </div>
  );
}
