import React, {  forwardRef,  LegacyRef, useState } from 'react';
import {  BlockInterface } from '../model';
import {  Block } from './';


const TableTools = () => {

  return <div>
    {/* <div className={}>💠</div> */}
  </div>

}

export const Table = forwardRef((props: BlockInterface, ref: LegacyRef<HTMLTableElement>) => {
  return (
    <div  ref={ref}>
      <TableTools/>
      <table className="md-table">
        <thead>
          <tr>
            {props.header.map((b, i) => (
              <th key={i}>
                <Block {...b} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, i) => (
            <tr key={i}>
              {row.map((b, i) => (
                <td key={i}>
                  <Block {...b} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
