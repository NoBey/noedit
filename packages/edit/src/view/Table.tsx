import React, { forwardRef, LegacyRef, MouseEventHandler, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BlockInterface } from '../model';
import { Block } from './';
import { Icon } from '@noedit/icon';
// import { Popper } from '@noedit/component';
import { createPortal } from 'react-dom';
import { useEditor } from '../hooks/useEditor';
import { EditorInterface } from '../editor';

const Cells = () => {
  const [size, setSize] = useState([3, 4]);
  const [show, setShow] = useState(false);
  const onMove: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target) {
      // @ts-ignore
      const col = event.target.dataset['col'];
      // @ts-ignore
      const row = event.target.dataset['row'];
      if (col && row) {
        if (col != size[0] && row != size[1]) {
          setSize([Number(col), Number(row)]);
        }
      }
    }
  };
  const click = (e) => {
    e.stopPropagation();
    const close = () => {
      setShow(false);
      window.removeEventListener('click', close);
    };
    window.addEventListener('click', close);
    setShow(true);
  };

  return (
    <span className={'cells-warp'}>
      <Icon size={10} onClick={click} type="liebiao" />
      {show ? (
        <div className={'cells-tips-wrap'} onClick={(e) => e.nativeEvent.stopPropagation()}>
          <div className="cells-grid" onMouseMove={onMove}>
            {new Array(6 * 9).fill(1).map((r, i) => {
              const col = Math.floor(i / 6) + 1;
              const row = Math.floor(i % 6) + 1;
              const props = {
                'data-col': col,
                'data-row': row,
                style: {},
              };
              if (size[0] >= col && size[1] >= row) {
                props.style = {
                  background: 'burlywood',
                };
              }
              return <div key={i} {...props}></div>;
            })}
          </div>
          <div className="cells-nums">
            <input value={size[1]} onChange={(e) => setSize([size[0], Number(e.target.value)])} />
            X
            <input value={size[0]} onChange={(e) => setSize([Number(e.target.value), size[0]])} />
            <button>确认</button>
          </div>
        </div>
      ) : (
        ''
      )}
    </span>
  );
};

function useStopBeforeinput(ref) {
  useEffect(() => {
    const stop = (e) => e.stopPropagation();
    ref.current.addEventListener('beforeinput', stop);
  }, []);
}

const TableTools = () => {
  const ref = useRef<HTMLDivElement>();
  useStopBeforeinput(ref);
  return (
    <div ref={ref} contentEditable={false} className="table-tools">
      <Cells />
    </div>
  );
};

function ControlLeft({row, col, insertAfterTableRow, insertAfterTableCol, deleteTableRow }: any) {
  const editor = useEditor();
  const ref = useRef<HTMLDivElement>();
  const [pos, setPos] = useState({ x: 0, y: 0, width: 0 });
  const [show, setShow] = useState(false);
  const click = (e) => {
    e.stopPropagation();
    const close = () => {
      setShow(false);
      window.removeEventListener('click', close);
    };
    window.addEventListener('click', close);
    setShow(true);
  };

  const scollTop = document.documentElement.scrollTop || document.body.scrollTop || editor?.container?.scrollTop;

  useEffect(() => {
    const { x, y, width } = ref.current.getBoundingClientRect();
    if (pos.x != x || pos.width != width) setPos({ x, y, width });
  });

  return (
    <>
      <div ref={ref} onClick={click} className="table-control-left" contentEditable={false}></div>
      {show
        ? editor.container &&
          createPortal(
            <div
              className="toolbar"
              onClick={(e) => e.nativeEvent.stopPropagation()}
              style={{ position: 'absolute', top: scollTop + pos.y, left: pos.width >> 1 }}
            >
              <Icon size={20} type={'zengjiahang'} onClick={() => {
                insertAfterTableRow(row)
              }} />
              <Icon size={20} type={'shanchu'} onClick={() => deleteTableRow(row)} />
            </div>,
            editor.container,
          )
        : ''}
    </>
  );
}

function ControlTop({row, col, insertAfterTableRow, insertAfterTableCol, deleteTableCol }: any) {
  const editor = useEditor();
  const ref = useRef<HTMLDivElement>();
  const [pos, setPos] = useState({ x: 0, y: 0, height: 0, width: 0 });
  const [show, setShow] = useState(false);
  const click = (e) => {
    e.stopPropagation();
    const close = () => {
      setShow(false);
      window.removeEventListener('click', close);
    };
    window.addEventListener('click', close);
    setShow(true);
  };

  const scollTop = document.documentElement.scrollTop || document.body.scrollTop || editor?.container?.scrollTop;
  const offsetLeft = editor?.container?.offsetLeft || 0;

  useEffect(() => {
    const { x, y, width, height } = ref.current.getBoundingClientRect();
    if (pos.x != x || pos.height != height) setPos({ x, y, height, width });
  });
  return (
    <>
      <div ref={ref} onClick={click} className="table-control-top" contentEditable={false}></div>
      {show
        ? editor.container &&
          createPortal(
            <div
              className="toolbar"
              onClick={(e) => e.nativeEvent.stopPropagation()}
              style={{ position: 'absolute', top: scollTop + pos.y, left: pos.x - offsetLeft + (pos.width >> 1) }}
            >
              <Icon size={20} type={'zengjialie'} onClick={() => insertAfterTableCol(col)} />
              <Icon size={20} type={'youduiqi'} />
              <Icon size={20} type={'zuoduiqi'} />
              <Icon size={20} type={'zuoyouduiqi'} />
              <Icon size={20} type={'shanchu'}  onClick={()=> deleteTableCol(col)}/>
            </div>,
            editor.container,
          )
        : ''}
    </>
  );
}



function deleteTableRow(editor: EditorInterface, tableBlock: BlockInterface, index){
  let header, rows
  if(index===0){
    header = tableBlock.rows[0]
    rows = [...tableBlock.rows]
    rows.splice(0, 1)
  }else{
    rows = [...tableBlock.rows]
    rows.splice(index - 1, 1)
  }
  editor.model.updateBlock(tableBlock, { header, rows  })
}

function deleteTableCol(editor: EditorInterface, tableBlock: BlockInterface, index){
  let header = [...tableBlock.header]
  header.splice(index-1, 1);
  let rows = [...tableBlock.rows].map(row => {
    const r = [...row]
    r.splice(index-1, 1)
    return r
  })
  editor.model.updateBlock(tableBlock, { header, rows })
}

function insertAfterTableCol(editor: EditorInterface, tableBlock: BlockInterface, index){
  let header = [...tableBlock.header]
  header.splice(index, 0, editor.createParagraphBlock());
  let rows = [...tableBlock.rows].map(row => {
     const r = [...row]
    r.splice(index, 0, editor.createParagraphBlock())
    return r
  })
  editor.model.updateBlock(tableBlock, { header, rows })
}

function insertAfterTableRow(editor: EditorInterface, tableBlock: BlockInterface, index: number){
  let header, rows
  const row = new Array(tableBlock.header.length).fill(1).map(() => editor.createParagraphBlock())
  if(index===0){
    rows = [row, ...tableBlock.rows]
  }else{
    rows = [...tableBlock.rows]
    rows.splice(index - 1, 0, row)
  }
  editor.model.updateBlock(tableBlock, { header: tableBlock.header, rows })
}





export const Table = forwardRef((props: BlockInterface, ref: LegacyRef<HTMLTableElement>) => {
  const [focus, setFocus] = useState({});
  const [pos, setPos] = useState({});
  const editor = useEditor();

  const crlProps = {
    insertAfterTableRow: insertAfterTableRow.bind(null, editor, props),
    insertAfterTableCol: insertAfterTableCol.bind(null, editor, props),
    deleteTableRow: deleteTableRow.bind(null, editor, props),
    deleteTableCol: deleteTableCol.bind(null, editor, props),
  }

  return (
    <div ref={ref} className="md-table">
      <TableTools />
      <table>
        <thead>
          <tr>
            {props.header.map((col, colIndex) => (
              <th
                key={colIndex}
                onClick={() => {
                  setFocus(col);
                  setPos({ row: 1, col: colIndex + 1 });
                }}
              >
                {colIndex === 0 ? <ControlLeft {...crlProps} row={1} col={colIndex + 1}/> : ''}
                <ControlTop {...crlProps} row={1} col={colIndex + 1} />
                <Block {...col} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((col, colIndex) => (
                <td
                  key={colIndex}
                  onClick={() => {
                    setFocus(col);
                    setPos({ row: rowIndex + 2, col: colIndex + 1 });
                  }}
                >
                  {colIndex === 0 ? <ControlLeft  {...crlProps} row={rowIndex + 2} col={colIndex + 1}/> : ''}
                  <Block {...col} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
