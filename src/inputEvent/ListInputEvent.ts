import { Block } from "src/block";
import { editor } from "src/editor";
import { selection } from "src/selection";
import { InputEventStrategy } from ".";

export class ListInputEvent implements InputEventStrategy {
  accept(inputType: string, event?: InputEvent): boolean {
    const { focusOffset, focusBlock } = selection;
    if (
      focusOffset === 0 &&
      inputType.startsWith("delete") &&
      focusBlock.parent.type === "list_item" &&
      focusBlock.parent.blocks.indexOf(focusBlock) === 0 &&
      selection.type === "Caret" &&
      focusBlock.parent.parent.blocks.indexOf(focusBlock.parent) !== 0
    ) {
      return true;
    }

    if (
      inputType === "insertParagraph" &&
      selection.type === "Caret" &&
      focusBlock.parent.type === "list_item" &&
      ((focusBlock.parent.blocks.indexOf(focusBlock) + 1 ===
        focusBlock.parent.blocks.length &&
        focusBlock.text === "") ||
        focusBlock.parent.blocks.indexOf(focusBlock) === 0)
    ) {
      return true;
    }

    return false;
  }
  execute(inputType: string, event?: InputEvent): void {
    const { focusOffset, focusBlock } = selection;
    if (
      focusOffset === 0 &&
      inputType.startsWith("delete") &&
      focusBlock.parent.type === "list_item" &&
      focusBlock.parent.blocks.indexOf(focusBlock) === 0 &&
      selection.type === "Caret"
    ) {
      const preBlock = Block.getPreviousBlock(focusBlock.parent);
      if (preBlock.blocks.length === 1 && preBlock.blocks[0].text === "") {
        editor.model.deleteBlock(preBlock.blocks[0].id);
      }
      editor.model.mergeBlock(preBlock, focusBlock.parent);
      editor.model.deleteBlock(focusBlock.parent.id);
    }
    if (inputType === "insertParagraph") {
      if (focusBlock.parent.blocks.indexOf(focusBlock) === 0) {
        const newBlock = Block.createListItemBlock(
          Block.createParagraphBlock(focusBlock.text.slice(focusOffset))
        );
        const text = focusBlock.text.slice(0, focusOffset);
        editor.model.updateBlock(focusBlock, { text });
        editor.model.insertAfter(focusBlock.parent, newBlock);
        selection.collapse(newBlock);
      }

      if (
        focusBlock.text === "" &&
        focusBlock.parent.blocks.indexOf(focusBlock) + 1 ===
          focusBlock.parent.blocks.length
      ) {
        editor.model.insertAfter(
          focusBlock.parent,
          Block.createListItemBlock(focusBlock)
        );
        editor.model.deleteBlock(focusBlock.id);
      }
    }
  }
}
