import { Block } from "./block";
import { Event } from "./Event";
import { createDelOperation, createUpdateOperation, startOperations } from "./operation";
import { selection } from "./selection";

export interface BlockInterface {
  id?: number | string;
  parent?: BlockInterface;
  blocks?: BlockInterface[];
  type: string;
  text?: string;
}

let index = 0;


export interface Model extends ReturnType<typeof createModel> {}

export function createModel(editor, _model: BlockInterface) {
  let timer;


  const normalize = (block: BlockInterface, parent?: BlockInterface) => {
    block.parent = parent;
    if (!block.id) block.id = ++index;
    editor.idToBlock.set(block.id, block);
    block.blocks.forEach((b) => normalize(b, block));
    if (["list_item", "blockquote", "list"].includes(block.type)) {
      if (block.blocks.length === 0) {
        model.deleteBlock(block.id);
      }
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
      console.log({ operation })
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
        if(startOffset === endOffset) return
        let text = startContainer.text;
        text = text.slice(0, startOffset) + text.slice(endOffset);
        model.applyOperation(
          createUpdateOperation(startContainer.id, { text })
        );
      } else {
      
        let text = startContainer.text.slice(0, startOffset);
        text += endContainer.text.slice(endOffset);
        model.updateBlock(startContainer, { text })

        const stack = [selection.commonAncestor || Block.getCommonBlock(startContainer, endContainer)];
        let flag = false;
        while (stack.length) {
          const block = stack.pop();
          [...block.blocks].reverse().forEach((b) => {
            stack.push(b);
          });
          if (flag && (Block.isTextBlock(block.id) || block.type === "hr")) {
            model.applyOperation(createDelOperation(block.id));
          }
          if (block === startContainer) flag = true;
          if (block === endContainer) break;
        }
      }

      selection.collapse(startContainer, startOffset);
    },
    insertText(data: string){
      const { focusOffset, focusBlock } = selection;

      let text = selection.focusBlock.text;
      text = text.slice(0, focusOffset) + data + text.slice(focusOffset);

      model.applyOperation(
        createUpdateOperation(selection.focusBlock.id, { text })
      );
      selection.collapse(focusBlock, focusOffset + data.length);
      Event.emit("block-change", focusBlock);
    },
    updateBlock(block: BlockInterface, arg){
      model.applyOperation(
        createUpdateOperation(block.id, arg)
      );
    },
    insertParagraph(): BlockInterface{
      const { focusBlock, focusOffset } = selection;
      const stext = focusBlock.text.slice(0, focusOffset)
      const etext = focusBlock.text.slice(focusOffset)
      const newBlock = Block.createParagraphBlock(etext);
      model.insertAfter(focusBlock, newBlock)
      model.applyOperation(
        createUpdateOperation(selection.focusBlock.id, { text: stext })
      );
      selection.collapse(newBlock)
      return newBlock
    },
    insertBefore(block: BlockInterface, newBlock: BlockInterface){
      const blocks = [...block.parent.blocks]
      const index = blocks.indexOf(block)
      blocks.splice(index, 0, newBlock);
      console.log( 'insertBefore',blocks)
      model.applyOperation(
        createUpdateOperation(block.parent.id, { blocks })
      );
    },
    insertAfter(block: BlockInterface, newBlock: BlockInterface){
      const blocks = [...block.parent.blocks]
      const index = blocks.indexOf(block)
      blocks.splice(index + 1, 0, newBlock);
      model.applyOperation(
        createUpdateOperation(block.parent.id, { blocks })
      );
    },
    replaceBlock(block: BlockInterface, newBlock: BlockInterface){
      const blocks = [...block.parent.blocks]
      const index = blocks.indexOf(block)
      blocks.splice(index, 1, newBlock);
      model.applyOperation(
        createUpdateOperation(block.parent.id, { blocks })
      )  
    },
    mergeBlock(targetBlock: BlockInterface, block: BlockInterface){
      const blocks = [...targetBlock.blocks, ...block.blocks]
      model.applyOperation(
        createUpdateOperation(targetBlock.id, { blocks })
      )  
    }


  };

  return model;
}
