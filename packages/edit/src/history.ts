// import hotkeys from "hotkeys-js"

import { Editor } from "./editor";
import { BlockInterface } from "./model";
import { Event } from "./Event";


export interface Selection {
  focusBlock: BlockInterface;
  focusOffset: number;
  type: string;
  range: Range;
}

export interface Record {
  ops: any[];
  before: Selection;
  after: Selection;
}

export class History {
  undoStack: Record[] = [];
  redoStack: Record[] = [];
  editor: Editor;
  constructor(editor) {
    this.editor = editor;
    this.init()
  }
  init(){
    Event.on("apply-operation", this.applyOperationStart.bind(this));
  }

  pauseRecord = false
  optimer = null
  operations = []
  beforeSelection = null
  applyOperationStart(operation){
    if(this.pauseRecord) return
    if(!this.beforeSelection) {
      const { focusBlock, focusOffset, type, range } = this.editor.selection
      this.beforeSelection = { focusBlock, focusOffset, type, range }
    }
    this.operations.push(operation)
    if(this.optimer) clearTimeout(this.optimer)
    const { operations } = this
    if(
      operation.type === "update"  && (operations.length === 1 || (operations[operations.length-2].type === 'update' && operations[operations.length-2].arg.id === operation.arg.id))
    ){
      this.optimer = setTimeout(() => this.applyOperationEnd() , 200)
    }else{
      this.optimer = setTimeout(() => this.applyOperationEnd() , 0)
    }

  }
  applyOperationEnd(){
    const { focusBlock, focusOffset, type, range } = this.editor.selection
    const { operations, beforeSelection } = this
    console.log(operations)
    this.add({ ops: operations, before: beforeSelection, after: { focusBlock, focusOffset, type, range } })

    this.operations = []
    this.beforeSelection = null
    this.optimer = null
  }

  add(record: Record) {
    this.undoStack.push(record);
  }
  undo() {
    const { editor } = this
    if (this.undoStack.length === 0) return;
    const record = this.undoStack.pop();
    this.pauseRecord = true
    record.ops.reverse().forEach((op) => {
      editor.model.applyOperation(op.invert());
    });
    this.pauseRecord = false
    const { before } = record
    if (before.type === "Range") {
      editor.selection.selection.addRange(before.range.cloneRange());
    } else {
      editor.selection.collapse(before.focusBlock, before.focusOffset);
    }
  }
  redo() {}
}
