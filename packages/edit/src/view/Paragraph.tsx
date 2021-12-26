import React, { forwardRef, LegacyRef } from "react";
import { InlineText } from ".";
import { editor } from "../editor";

export const Paragraph = forwardRef(
    ({ text, id }: any, ref: LegacyRef<HTMLParagraphElement>) => {
      return (
        <p ref={ref}>
          <InlineText text={text} id={id} />
        </p>
      );
    }
  );
  
  export const TextBlock = forwardRef(
    ({ text, id }: any, ref: LegacyRef<HTMLParagraphElement>) => {
      return (
        <p ref={ref}>
          <InlineText text={text} id={id} />
        </p>
      );
    }
  );