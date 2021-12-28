import { InputEventStrategy } from ".";
// import { BlockUtil } from "../block";
import { EditorInterface } from "../editor";

export class TableInputEvent implements InputEventStrategy {
  editor: EditorInterface
  constructor(editor: EditorInterface) {
    this.editor = editor
  }
    accept(inputType: string, event?: InputEvent): boolean {
      const { editor } = this
      const { selection } = editor
      const { focusOffset, focusBlock, anchorBlock } = selection;
      if (
        focusOffset === 0 &&
        inputType.startsWith("delete") &&
        focusBlock.parent.type === "table" &&
        focusBlock.parent.blocks.indexOf(focusBlock) === 0 && 
        selection.type === "Caret"
      ) {
        return true
      }
      if (
        inputType === "insertParagraph" &&
        (focusBlock.parent.type === "table" || anchorBlock.parent.type === "table")
      ) {
        return true
      }
  
      return false;
    }
    execute(inputType: string, event?: InputEvent): void {
      const { editor } = this
      const { selection } = editor
      const { focusOffset, focusBlock } = selection;
  
      if (
        focusOffset === 0 &&
        inputType.startsWith("delete") &&
        focusBlock.parent.type === "table" &&
        focusBlock.parent.blocks.indexOf(focusBlock) === 0 && 
        selection.type === "Caret"
      ) {
        const block = editor.getPreviousTextBlock(focusBlock.id)
        editor.model.deleteBlock( focusBlock.parent.id )
        selection.collapse(block, block.text.length);
      }
    }
  }