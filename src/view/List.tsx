import React, { forwardRef, LegacyRef } from "react";
import { BlockList } from "./";

function CheckBox({ value, onChange = (v) => {} }) {
  return (
    <input
      contentEditable={false}
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
      type="checkbox"
    />
  );
}

// task
export const ListItem = forwardRef(
  ({ blocks, task = false, checked }: any, ref: LegacyRef<HTMLLIElement>) => {
    return (
      <li ref={ref} className={task && "md-list-task-item"}>
        {task && <CheckBox value={checked} onChange={(v) => console.log(v)} />}
        <BlockList blocks={blocks} />
      </li>
    );
  }
);

export const List = forwardRef(
  ({ blocks }: any, ref: LegacyRef<HTMLUListElement>) => {
    return (
      <ul ref={ref}>
        <BlockList blocks={blocks} />
      </ul>
    );
  }
);
