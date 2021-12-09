import { Block } from './block';
import { Event } from './Event'
import { createDelOperation } from './operation';
import { selection } from './selection';


export interface BlockInterface {
  id?: number | string;
  parent?: BlockInterface,
  blocks?: BlockInterface[]
  type: string,
  text?: string
} 

let index = 0;

export const idToBlock = new Map
// @ts-ignore
window.idToBlock = idToBlock


export interface Model extends ReturnType< typeof createModel> {}

export function createModel(editor, _model: BlockInterface) {
  let timer

  const normalize = (block: BlockInterface, parent?:BlockInterface) => {
    block.parent = parent;
    if (!block.id) block.id = ++index;
    idToBlock.set(block.id, block)
    block.blocks.forEach((b) => normalize(b, block));
    if (["list_item", "blockquote", "list"].includes(block.type)) {
      if (block.blocks.length === 0) {
        model.deleteBlock(block.id);
      }
    }
    return block;
  }

  const model = {
    editor,
    _model: normalize(_model),
    normalize,
    onChange(cb) {
      Event.on('model-change', cb, editor)
    },
    applyModelChange() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        model.normalize(model._model);
        Event.emit('model-change', editor.model)
        selection.reset();
      }, 0);
    },
    deleteBlock(id) {
      model.applyOperation(createDelOperation(id));
    },
    applyOperation(operation) {
      const { type, arg } = operation;
      if (type === "update") {
        const block = Block.getBlockByid(arg.id);
        const keys = Object.keys(arg);
        keys.forEach((k) => {
          block[k] = arg[k];
        });
      }
      if (type === "delete") {
        const block = Block.getBlockByid(arg.id);
        block.parent.blocks = block.parent.blocks.filter(
          ({ id }) => id !== arg.id
        );
      }

      model.applyModelChange();
    },
  };

  return model
}
