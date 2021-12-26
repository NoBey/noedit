import React, { forwardRef, LegacyRef } from "react";
import { Block } from './'

export const Table = forwardRef(
    (props: any, ref: LegacyRef<HTMLTableElement>) => {
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
  