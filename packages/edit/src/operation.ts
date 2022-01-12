// import { BlockUtil } from "./block";
// import { editor } from "./editor";
// insert_node merge_node move_node remove_node split_node set_node

import { EditorInterface } from "./editor"

export const operations = []

let optimer
export function startOperations(editor, op){
  operations.push(op)
  if(optimer) clearTimeout(optimer)
  optimer = setTimeout(() => stopOperations(editor) , 10)
}
function stopOperations(editor){
  const { focusBlock, focusOffset, type, range } = editor.selection
  editor.history.add({ ops: [...operations] , focusBlock, focusOffset, type, range: range })
  operations.length = 0
}


export function createUpdateOperation(editor, id, arg) {
  const _arg = {}
  const keys = Object.keys(arg)
  const block = editor.getBlockByid(id)
  keys.forEach(k => _arg[k] = block?.[k] || undefined )

  const invert = () => {
    return createOperation(editor, "update", { id, ..._arg })
  }
  return createOperation(editor, "update", { id, ...arg }, invert);
}

export function createDelOperation(editor, id) {
  const block = editor.getBlockByid(id)
  const arg = { id: block.parent.id, blocks: [...block.parent.blocks] }

  const invert = () => {
    return createOperation(editor, "update", arg) 
  }
  return createOperation(editor, "delete", { id }, invert );
}

export function createOperation(editor: EditorInterface, type, arg, invert?: any) {
  const op = {
    type,
    arg,
    invert
  }
  if(invert) startOperations(editor, op)

  return op;
}
