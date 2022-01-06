import React, { forwardRef, LegacyRef, useState } from 'react';
import { useEditor } from '../hooks/useEditor';
import { BlockInterface } from '../protocol/model';
// import { editor } from "../editor";
import { BlockList } from './';

function CheckBox({ value, onChange = (v) => {} }) {
  return <input contentEditable={false} checked={value} onChange={(e) => onChange(e.target.checked)} type="checkbox" />;
}

// task
export const ListItem = forwardRef(
  ({ blocks, task = false, checked, id }: BlockInterface, ref: LegacyRef<HTMLLIElement>) => {
    const editor = useEditor();
    const change = (checked) => {
      if (id) editor.model.updateBlockById(id as string, { checked });
    };

    return (
      <li ref={ref} className={task ? 'md-list-task-item' : ''}>
        {task && <CheckBox value={checked} onChange={change} />}
        <BlockList blocks={blocks} />
      </li>
    );
  },
);

export const List = forwardRef(({ blocks, ordered, start }: BlockInterface, ref: any) => {
  const Cpm = ordered ? 'ol' : 'ul';
  return (
    <Cpm ref={ref} start={start}>
      <BlockList blocks={blocks} />
    </Cpm>
  );
});
