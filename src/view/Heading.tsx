import React, { forwardRef } from "react";
import { InlineText } from "./";

export const Heading = forwardRef(({ text, depth, id }: any, ref: any) => {
  const H = "h" + depth;
  return (
    // @ts-ignore
    <H ref={ref}>
      <InlineText text={text} id={id} />
    </H>
  );
});
