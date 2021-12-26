import { Block } from "./block";
import { Event } from "./Event";
import {
  createDelOperation,
  createUpdateOperation,
  startOperations,
} from "./operation";
import { selection } from "./selection";

export interface BlockInterface {
  id?: number | string;
  parent?: BlockInterface;
  blocks?: BlockInterface[];
  type: string;
  text?: string;
  header?: BlockInterface[];
  rows?: BlockInterface[][];
  depth?: number;
  task?: boolean;
  checked?: boolean;
}

let index = 0;

export interface Model extends ReturnType<typeof createModel> {}

export function createModel(editor, _model: BlockInterface) {
  let timer;

  const normalize = (block: BlockInterface, parent?: BlockInterface) => {
    block.parent = parent;
    if (!block.id) block.id = ++index;
    editor.idToBlock.set(block.id, block);
    block?.blocks?.forEach((b) => normalize(b, block));
    if (["list_item", "blockquote", "list"].includes(block.type)) {
      if (block.blocks.length === 0) {
        model.deleteBlock(block.id);
      }
    }
    if (block.type === "table") {
      block.blocks = []
      block.header.forEach((b) => {
        block.blocks.push(b)
        normalize(b, block)
      });
      block.rows.forEach((row = []) =>
        row.forEach((b) => {
          block.blocks.push(b)
          normalize(b, block);
        })
      );
    }
    return block;
  };

  const model = {
    editor,
    _model: normalize(_model),
    normalize,
    onChange(cb) {
      Event.on("model-change", cb, editor);
    },
    applyModelChange() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        model.normalize(model._model);
        Event.emit("model-change", editor.model);
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
    deleteContent(range) {
      const { startContainer, endContainer, startOffset, endOffset } =
        Block.range(range);

      if (startContainer === endContainer) {
        if (startOffset === endOffset) return;
        let text = startContainer.text;
        if (startOffset + 1 === endOffset) {
          if (
            ["`", "*", "_", "'", '"'].includes(text[startOffset]) &&
            text[startOffset] === text[endOffset]
          ) {
            text = text.slice(0, startOffset) + text.slice(endOffset + 1);
          } else if (
            ["{", "[", "("].includes(text[startOffset]) &&
            text[endOffset] ===
              { "{": "}", "[": "]", "(": ")" }[text[startOffset]]
          ) {
            text = text.slice(0, startOffset) + text.slice(endOffset + 1);
          } else {
            text = text.slice(0, startOffset) + text.slice(endOffset);
          }
        } else {
          text = text.slice(0, startOffset) + text.slice(endOffset);
        }
        model.applyOperation(
          createUpdateOperation(startContainer.id, { text })
        );
      } else {
        let text = startContainer.text.slice(0, startOffset);
        text += (endContainer?.text||'').slice(endOffset);
        model.updateBlock(startContainer, { text });

        const stack = [Block.getCommonBlock(startContainer, endContainer)];
        let flag = false;
        while (stack.length) {
          const block = stack.pop();
          [...(block.blocks || [])].reverse().forEach((b) => {
            stack.push(b);
          });
          if (flag && (Block.isTextBlock(block.id) || block.type === "hr" || block.type === "table")) {
            if(block?.parent?.type === 'table'){
              model.applyOperation(createUpdateOperation(block.id, { text: "" }));
            }else{
              model.applyOperation(createDelOperation(block.id));
            }
          }
          if (block === startContainer) flag = true;
          if (block === endContainer) break;
        }
      }

      selection.collapse(startContainer, startOffset);
    },
    insertText(data: string) {
      const { focusOffset, focusBlock } = selection;
      let text = selection.focusBlock.text || "";
      text = text.slice(0, focusOffset) + data;
      if (
        ["`", "*", "_", "'", '"'].includes(data) &&
        data !== text[focusOffset - 1]
      ) {
        if (selection.focusBlock.text[focusOffset] === data) {
          text = text.slice(0, text.length - 1);
        } else {
          text += data;
        }
      }
      if (["{", "[", "("].includes(data)) {
        text += { "{": "}", "[": "]", "(": ")" }[data];
      }
      text += selection.focusBlock.text.slice(focusOffset);

      model.applyOperation(
        createUpdateOperation(selection.focusBlock.id, { text })
      );
      console.log(focusOffset, data.length, data, text)
      selection.collapse(focusBlock, focusOffset + data.length);
      Event.emit("block-change", focusBlock);
    },
    updateBlock(block: BlockInterface, arg) {
      model.applyOperation(createUpdateOperation(block.id, arg));
    },
    updateBlockById(id: string, arg) {
      model.applyOperation(createUpdateOperation(id, arg));
    },
    insertParagraph(): BlockInterface {
      const { focusBlock, focusOffset } = selection;
      const stext = focusBlock.text.slice(0, focusOffset);
      const etext = focusBlock.text.slice(focusOffset);
      const newBlock = Block.createParagraphBlock(etext);
      model.insertAfter(focusBlock, newBlock);
      model.applyOperation(
        createUpdateOperation(selection.focusBlock.id, { text: stext })
      );
      selection.collapse(newBlock);
      return newBlock;
    },

    insertBefore(block: BlockInterface, newBlock: BlockInterface) {
      const blocks = [...block.parent.blocks];
      const index = blocks.indexOf(block);
      blocks.splice(index, 0, newBlock);
      console.log("insertBefore", blocks);
      model.applyOperation(createUpdateOperation(block.parent.id, { blocks }));
    },

    insertAfter(block: BlockInterface, newBlock: BlockInterface) {
      const blocks = [...block.parent.blocks];
      const index = blocks.indexOf(block);
      blocks.splice(index + 1, 0, newBlock);
      model.applyOperation(createUpdateOperation(block.parent.id, { blocks }));
    },

    insertAfterBlocks(block: BlockInterface, newBlocks: BlockInterface[]) {
      const blocks = [...block.parent.blocks];
      const index = blocks.indexOf(block);
      blocks.splice(index + 1, 0, ...newBlocks);
      model.applyOperation(createUpdateOperation(block.parent.id, { blocks }));
    },

    insertBlocks(blocks: BlockInterface[]){
      const { focusBlock, focusOffset } = selection
      if(!blocks.length) return
      let text = focusBlock.text ? focusBlock.text.slice(0, focusOffset) : ""
      const last = blocks[blocks.length - 1]
      const lastOffset = focusBlock.text.length - focusOffset
      last.text += focusBlock?.text?.slice?.(focusOffset) || ''
      const first = blocks.shift()
      text += (first?.text || '')
      model.applyOperation(createUpdateOperation(focusBlock.id, { text }));
      if(blocks.length){
        this.insertAfterBlocks(focusBlock, blocks)
      }
      if(blocks.includes(last)){
        selection.collapse(last, last.text.length - lastOffset)
      }else{
        selection.collapse(focusBlock, focusBlock.text.length - lastOffset)
      }

    },

    replaceBlock(block: BlockInterface, newBlock: BlockInterface) {
      const blocks = [...block.parent.blocks];
      const index = blocks.indexOf(block);
      blocks.splice(index, 1, newBlock);
      model.applyOperation(createUpdateOperation(block.parent.id, { blocks }));
    },
    mergeBlock(targetBlock: BlockInterface, block: BlockInterface) {
      const blocks = [...targetBlock.blocks, ...block.blocks];
      model.applyOperation(createUpdateOperation(targetBlock.id, { blocks }));
    },
  };

  return model;
}
