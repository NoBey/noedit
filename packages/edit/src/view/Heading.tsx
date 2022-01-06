import React, { forwardRef } from 'react';
import { BlockInterface } from '../protocol/model';
import { InlineText } from './inline';

type Headingtype = `h${[1, 2, 3, 4, 5, 6][number]}`; // 'h1' | 'h2'| 'h3' | 'h4' | 'h5' | 'h6'

const fill = (len = 0) => new Array(len).fill('#').join('');

// TODO: 需要改成 使用 raw 数据
export const Heading = forwardRef(({ text, depth, id, raw }: BlockInterface, ref: any) => {
  const H = ('h' + depth) as Headingtype;
  return (
    <H ref={ref}>
      {/* <span className={'md-block-meta'}>{fill(depth)}</span> */}
      <InlineText text={text} id={id} />
      {/* <InlineText text={text raw.slice(depth)} id={id} /> */}
    </H>
  );
});
