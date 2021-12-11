// import hotkeys from "hotkeys-js"


import { editor, Editor  } from "./editor";
import { BlockInterface } from "./model";
export interface Record {
  ops: any[],
  focusBlock: BlockInterface,
  focusOffset: number,
  type: string,
  range: Range
}

export class History {
  undoStack: Record[] = [];
  redoStack: Record[] = [];
  editor: Editor
  constructor(editor) {
    this.editor = editor
    // hotkeys('ctrl+z, command+z', () => {
    //   console.log('undo')
    //   return false;
    // });
  }
  add(record: Record) {
    this.undoStack.push(record);
  }
  undo() {
    console.log('undo')
    if(this.undoStack.length === 0) return
    const record = this.undoStack.pop()
    if(record.type === "Range"){
      editor.selection.selection.addRange(record.range.cloneRange())
    }else{
      editor.selection.collapse(record.focusBlock, record.focusOffset)
    }
    record.ops.reverse().forEach(op => {
      editor.model.applyOperation(op.invert())
    })
    
  }
  redo() {}
}

