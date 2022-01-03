// import { BlockUtil } from "./block";
import { Event } from "./Event";
import {
  createDelOperation,
  createUpdateOperation,
} from "./operation";
// import { selection } from "./selection";
import { EditorInterface } from "./editor";

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
  ordered?:boolean;
  start?: number;
  raw?: string;
}

let index = 0;

// export type ModelInterface = typeof Model
export interface ModelInterface extends Model { }

export class Model {
  editor: EditorInterface
  _model: BlockInterface
  constructor(editor, _model: BlockInterface) {
    this.editor = editor
    
    this.normalize = this.normalize.bind(this)
    this._model = this.normalize(_model)
  }
  normalize(block: BlockInterface, parent?: BlockInterface) {
    const { editor, normalize } = this

    block.parent = parent;
    if (!block.id) block.id = ++index;
    editor.idToBlock.set(block.id, block);
    block?.blocks?.forEach((b) => normalize(b, block));
    if (["list_item", "blockquote", "list"].includes(block.type)) {
      if (block.blocks.length === 0) {
        this.deleteBlock(block.id);
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
  }

  onChange(cb) {
    Event.on("model-change", cb, this.editor);
  }

  timer = null
  applyModelChange() {
    const { editor } = this
    const { selection } = editor
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.normalize(this._model);
      Event.emit("model-change", editor.model);
      selection.reset();
    }, 0);
  }

  applyOperation(operation) {
    const { editor } = this
    const { type, arg } = operation;
    if (type === "update") {
      const block = editor.getBlockByid(arg.id);
      const keys = Object.keys(arg);
      keys.forEach((k) => {
        block[k] = arg[k];
      });
    }
    if (type === "delete") {
      const block = editor.getBlockByid(arg.id);
      block.parent.blocks = block.parent.blocks.filter(
        ({ id }) => id !== arg.id
      );
    }

    this.applyModelChange();
  }

  deleteBlock(id) {
    this.applyOperation(createDelOperation(this.editor, id));
  }

  deleteContent(range) {
    const { editor } = this
    const { selection } = this.editor
    const { startContainer, endContainer, startOffset, endOffset } =
    editor.range(range);
//  console.log(range,  editor.range(range))
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
      this.applyOperation(
        createUpdateOperation(editor, startContainer.id, { text })
      );
    } else {
      let text = startContainer.text.slice(0, startOffset);
      text += (endContainer?.text || '').slice(endOffset);
      this.updateBlock(startContainer, { text });

      const stack = [editor.getCommonBlock(startContainer, endContainer)];
      let flag = false;
      while (stack.length) {
        const block = stack.pop();
        [...(block.blocks || [])].reverse().forEach((b) => {
          stack.push(b);
        });
        if (flag && (editor.isTextBlock(block.id) || block.type === "hr" || block.type === "table")) {
          if (block?.parent?.type === 'table') {
            this.applyOperation(createUpdateOperation(editor, block.id, { text: "" }));
          } else {
            this.applyOperation(createDelOperation(editor, block.id));
          }
        }
        if (block === startContainer) flag = true;
        if (block === endContainer) break;
      }
    }

    selection.collapse(startContainer, startOffset);
  }

  insertText(data: string) {
    const { selection } = this.editor
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

    this.applyOperation(
      createUpdateOperation(this.editor, selection.focusBlock.id, { text })
    );
    console.log(focusOffset, data.length, data, text)
    selection.collapse(focusBlock, focusOffset + data.length);
    Event.emit("block-change", focusBlock);
  }

  updateBlock(block: BlockInterface, arg) {
    this.applyOperation(createUpdateOperation(this.editor, block.id, arg));
  }

  updateBlockById(id: string, arg) {
    this.applyOperation(createUpdateOperation(this.editor, id, arg));
  }

  insertParagraph(): BlockInterface {
    const { editor } = this
    const { selection } = this.editor
    const { focusBlock, focusOffset } = selection;
    const stext = focusBlock.text.slice(0, focusOffset);
    const etext = focusBlock.text.slice(focusOffset);
    const newBlock = editor.createParagraphBlock(etext);
    this.insertAfter(focusBlock, newBlock);
    this.applyOperation(
      createUpdateOperation(editor, selection.focusBlock.id, { text: stext })
    );
    selection.collapse(newBlock);
    return newBlock;
  }

  insertBefore(block: BlockInterface, newBlock: BlockInterface) {
    const blocks = [...block.parent.blocks];
    const index = blocks.indexOf(block);
    blocks.splice(index, 0, newBlock);
    console.log("insertBefore", blocks);
    this.applyOperation(createUpdateOperation(this.editor,block.parent.id, { blocks }));
  }
  insertAfter(block: BlockInterface, newBlock: BlockInterface) {
    const blocks = [...block.parent.blocks];
    const index = blocks.indexOf(block);
    blocks.splice(index + 1, 0, newBlock);
    this.applyOperation(createUpdateOperation(this.editor, block.parent.id, { blocks }));
  }

  insertAfterBlocks(block: BlockInterface, newBlocks: BlockInterface[]) {
    const blocks = [...block.parent.blocks];
    const index = blocks.indexOf(block);
    blocks.splice(index + 1, 0, ...newBlocks);
    this.applyOperation(createUpdateOperation(this.editor, block.parent.id, { blocks }));
  }

  insertBlocks(blocks: BlockInterface[]) {
    const { selection } = this.editor
    const { focusBlock, focusOffset } = selection
    if (!blocks.length) return
    let text = focusBlock.text ? focusBlock.text.slice(0, focusOffset) : ""
    const last = blocks[blocks.length - 1]
    const lastOffset = focusBlock.text.length - focusOffset
    last.text += focusBlock?.text?.slice?.(focusOffset) || ''
    const first = blocks.shift()
    text += (first?.text || '')
    this.applyOperation(createUpdateOperation(this.editor, focusBlock.id, { text }));
    if (blocks.length) {
      this.insertAfterBlocks(focusBlock, blocks)
    }
    if (blocks.includes(last)) {
      selection.collapse(last, last.text.length - lastOffset)
    } else {
      selection.collapse(focusBlock, focusBlock.text.length - lastOffset)
    }

  }

  replaceBlock(block: BlockInterface, newBlock: BlockInterface) {
    const blocks = [...block.parent.blocks];
    const index = blocks.indexOf(block);
    blocks.splice(index, 1, newBlock);
    this.applyOperation(createUpdateOperation(this.editor, block.parent.id, { blocks }));
  }
  mergeBlock(targetBlock: BlockInterface, block: BlockInterface) {
    const blocks = [...targetBlock.blocks, ...block.blocks];
    this.applyOperation(createUpdateOperation(this.editor, targetBlock.id, { blocks }));
  }

}
