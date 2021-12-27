import { BlockUtil } from "./block";
import { editor } from "./editor";
// insert_node merge_node move_node remove_node split_node set_node

export const operations = []

let optimer
export function startOperations(op){
  operations.push(op)
  if(optimer) clearTimeout(optimer)
  optimer = setTimeout(() => stopOperations() , 10)
}
function stopOperations(){
  const { focusBlock, focusOffset, type, range } = editor.selection
  editor.history.add({ ops: [...operations] , focusBlock, focusOffset, type, range: range })
  operations.length = 0
}


export function createUpdateOperation(id, arg) {
  const _arg = {}
  const keys = Object.keys(arg)
  const block = BlockUtil.getBlockByid(id)
  keys.forEach(k => _arg[k] = block[k])

  const invert = () => {
    return createOperation("update", { id, ..._arg })
  }
  return createOperation("update", { id, ...arg }, invert);
}

export function createDelOperation(id) {
  const block = BlockUtil.getBlockByid(id)
  const arg = { id: block.parent.id, blocks: [...block.parent.blocks] }

  const invert = () => {
    return createOperation("update", arg) 
  }
  return createOperation("delete", { id }, invert );
}

export function createOperation(type, arg, invert?: any) {
  const op = {
    type,
    arg,
    invert
  }
  if(invert) startOperations(op)

  return op;
}
