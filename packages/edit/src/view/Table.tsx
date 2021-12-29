import React, { forwardRef, LegacyRef } from "react";
import { BlockInterface } from "../model";
import { Block } from './'

export const Table = forwardRef(
    (props: BlockInterface, ref: LegacyRef<HTMLTableElement>) => {
      return (
        <table ref={ref} className="md-table">
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
      );
    }
  );
  