import React, { forwardRef, LegacyRef } from "react";
import { InlineText } from "./inline";
import { BlockInterface } from "../model";
// import { editor } from "../editor";

export const Paragraph = forwardRef(
  ({ text, id }: BlockInterface, ref: LegacyRef<HTMLParagraphElement>) => {

    if (/^\`{3,10}[A-Za-z0-9]*$/.test(text)) {
      const [left] = /^\`{3,10}/.exec(text)
      const right = text.slice(left.length)
      return <p ref={ref}>
        <span style={{ color: "#ccc" }}>{left}</span><span style={{ color: "#b4654d" }}>{right}</span>
      </p>
    }

    return (
      <p ref={ref}>
        <InlineText text={text} id={id} />
      </p>
    );
  }
);

export const TextBlock = forwardRef(
  ({ text, id }: BlockInterface, ref: LegacyRef<HTMLParagraphElement>) => {
    return (
      <p ref={ref}>
        <InlineText text={text} id={id} />
      </p>
    );
  }
);