import { editor } from "src/editor";
import { selection } from "src/selection";
import { InputEventStrategy } from ".";

export class BlockquoteInputEvent implements InputEventStrategy {
    accept(inputType: string, event?: InputEvent): boolean {
      const { focusOffset, focusBlock } = selection;
      if (
        focusOffset === 0 &&
        inputType.startsWith("delete") &&
        focusBlock.parent.type === "blockquote" &&
        focusBlock.parent.blocks.indexOf(focusBlock) === 0
      ) {
        return true
      }
  
      if (
        focusBlock.text === "" &&
        inputType === "insertParagraph" &&
        focusBlock.parent.type === "blockquote" &&
        focusBlock.parent.blocks.indexOf(focusBlock) + 1 === focusBlock.parent.blocks.length
      ) {
        return true
      }
  
      return false;
    }
    execute(inputType: string, event?: InputEvent): void {
      const { focusOffset, focusBlock } = selection;
      if (
        focusOffset === 0 &&
        inputType.startsWith("delete") &&
        focusBlock.parent.type === "blockquote" &&
        focusBlock.parent.blocks.indexOf(focusBlock) === 0
      ) {
        editor.model.deleteBlock(focusBlock.id)
        return editor.model.insertBefore(focusBlock.parent, focusBlock);
      }
  
      if (
        focusBlock.text === "" &&
        inputType === "insertParagraph" &&
        focusBlock.parent.type === "blockquote" &&
        focusBlock.parent.blocks.indexOf(focusBlock) + 1 === focusBlock.parent.blocks.length
      ) {
        editor.model.deleteBlock(focusBlock.id)
        editor.model.insertAfter(focusBlock.parent, focusBlock)
        return 
      }
    }
  }