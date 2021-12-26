import React, { forwardRef, LegacyRef } from "react";
import { BlockList } from "./";

export const Blockquote = forwardRef(
  ({ blocks }: any, ref: LegacyRef<HTMLElement>) => {
    return (
      <blockquote ref={ref}>
        <BlockList blocks={blocks} />
      </blockquote>
    );
  }
);
