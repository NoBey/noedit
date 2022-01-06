import React, { forwardRef, LegacyRef } from 'react';
import { InlineText } from './inline';
import { BlockInterface } from '../protocol/model';
// import { editor } from "../editor";

export const Paragraph = forwardRef(({ text, id }: BlockInterface, ref: LegacyRef<HTMLParagraphElement>) => {
  return (
    <p ref={ref}>
      <InlineText text={text} id={id} />
    </p>
  );
});

export const TextBlock = forwardRef(({ text, id }: BlockInterface, ref: LegacyRef<HTMLParagraphElement>) => {
  return (
    <p ref={ref}>
      <InlineText text={text} id={id} />
    </p>
  );
});
