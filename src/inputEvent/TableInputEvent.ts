import { editor } from "src/editor";
import { selection } from "src/selection";
import { InputEventStrategy } from ".";
import { Block } from "../block";

export class TableInputEvent implements InputEventStrategy {
    accept(inputType: string, event?: InputEvent): boolean {
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
      const { focusOffset, focusBlock } = selection;
  
      if (
        focusOffset === 0 &&
        inputType.startsWith("delete") &&
        focusBlock.parent.type === "table" &&
        focusBlock.parent.blocks.indexOf(focusBlock) === 0 && 
        selection.type === "Caret"
      ) {
        const block = Block.getPreviousTextBlock(focusBlock.id)
        editor.model.deleteBlock( focusBlock.parent.id )
        selection.collapse(block, block.text.length);
      }
    }
  }