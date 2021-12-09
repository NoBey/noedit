import { selection, SelectionInterface } from "./selection";
import { createUpdateOperation, createDelOperation } from "./operation";
import { Block } from "./block";
import { createModel, Model } from "./model";
import { parseMD } from "./parse";

class Editor {
  model: Model
  selection: SelectionInterface
  constructor(){
    this.model = createModel(this, parseMD())
    this.selection = selection
  }

  deleteContentBackward(){
    const { selection, model } = this;
    if (selection.type === "Range") {
      const {
        startOffset,
        endOffset,
        startContainer,
        endContainer,
        commonAncestor
      } = selection;
      if (startContainer === endContainer) {
        let text = selection.focusBlock.text;
        text = text.slice(0, startOffset) + text.slice(endOffset);
        model.applyOperation(
          createUpdateOperation(startContainer.id, { text })
        );
        selection.collapse(startContainer, startOffset);
        return;
      }
      // TODO:
      startContainer.text = startContainer.text.slice(0, startOffset);
      startContainer.text += endContainer.text.slice(endOffset);
      const stack = [commonAncestor];
      let flag = false;
      while (stack.length) {
        const block = stack.pop();
        [...block.blocks].reverse().forEach((b) => {
          stack.push(b);
        });
        if (flag && Block.isTextBlock(block.id)) {
          model.applyOperation(createDelOperation(block.id));
        }
        if (block === startContainer) flag = true;
        if (block === endContainer) break;
      }
      selection.collapse(startContainer, startOffset);
    } else {
      const { focusOffset, focusBlock } = selection;

      if (focusBlock.parent.type === "list_item" && focusOffset === 0) {
        const parent = focusBlock.parent;
        const parentBlocks = [...focusBlock.parent.blocks];
        const parentBlocksIndex = parentBlocks.indexOf(focusBlock);
        if (parentBlocksIndex === 0) {
          const parentBlocks = [...parent.parent.blocks];
          const parentBlocksIndex = parentBlocks.indexOf(parent);
          if (parentBlocksIndex > 0) {
            const preBlock = parentBlocks[parentBlocksIndex - 1];
            const blocks = [...preBlock.blocks, ...parent.blocks];

            model.applyOperation(
              createUpdateOperation(preBlock.id, { blocks })
            );
            model.applyOperation(createDelOperation(parent.id));
            selection.collapse(focusBlock);
            return;
          }
        }
      }

      if (focusOffset === 0) {
        let text = focusBlock.text;
        const preBlock = Block.getPreviousTextBlock(focusBlock.id);
        if (preBlock === focusBlock) return;
        text = preBlock.text + text;
        const offset = preBlock.text.length;
        model.applyOperation(createUpdateOperation(preBlock.id, { text }));
        model.applyOperation(createDelOperation(focusBlock.id));
        selection.collapse(preBlock, offset);
        return;
      }
      let text = focusBlock.text;
      text = text.slice(0, focusOffset - 1) + text.slice(focusOffset);
      model.applyOperation(createUpdateOperation(focusBlock.id, { text }));
      selection.collapse(focusBlock, focusOffset - 1);
      return;
    }
  }

  insertText(data){
    console.log('insertText', data)
    const { selection, model } = this;
      const { focusOffset, focusBlock } = selection;

      let text = selection.focusBlock.text;
      text = text.slice(0, focusOffset) + data + text.slice(focusOffset);

      model.applyOperation(
        createUpdateOperation(selection.focusBlock.id, { text })
      );

      // TODO:
      if (text.startsWith("> ")) {
        const newBlock = Block.createBlockquoteBlock(focusBlock);
        focusBlock.text = focusBlock.text.replace("> ", "");
        // editor.applyOperation(createDelOperation(focusBlock.id));
        const parentBlocks = [...focusBlock.parent.blocks];
        const parentBlocksIndex = parentBlocks.indexOf(focusBlock);
        parentBlocks.splice(parentBlocksIndex, 1, newBlock);
        model.applyOperation(
          createUpdateOperation(focusBlock.parent.id, {
            blocks: parentBlocks
          })
        );
        selection.collapse(newBlock);
        return;
      }

      if (text.startsWith("- ")) {
        const newBlock = Block.createListBlock(focusBlock);
        focusBlock.text = focusBlock.text.replace("- ", "");
        // editor.applyOperation(createDelOperation(focusBlock.id));
        const parentBlocks = [...focusBlock.parent.blocks];
        const parentBlocksIndex = parentBlocks.indexOf(focusBlock);
        parentBlocks.splice(parentBlocksIndex, 1, newBlock);
        model.applyOperation(
          createUpdateOperation(focusBlock.parent.id, {
            blocks: parentBlocks
          })
        );
        selection.collapse(newBlock);
        return;
      }

      selection.collapse(focusBlock, focusOffset + 1);
  }

  insertParagraph(){

  }

  onBeforeInput = (event: InputEvent) => {
    const { inputType } = event
    console.log(event, event.getTargetRanges())
    if (inputType === "deleteContentBackward") {
      this.deleteContentBackward();
    }
    if (inputType === "insertText") {
      this.insertText(event.data);
    }
    if (inputType === "insertParagraph") {
      this.insertParagraph();
    }

    event.preventDefault();
  }
}

export const editor = new Editor
// @ts-ignore
window.editor = editor;

  

// export let index = 0;
// export const idToBlock = {};

// export const editor = createEditor({ model: formatRoot(tokens) });
// window.editor = editor;


