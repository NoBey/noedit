// import { BlockUtil } from "../block";
import { InputEventStrategy } from ".";
import { EditorInterface } from "../editor";

export class ListInputEvent implements InputEventStrategy {
  editor: EditorInterface
  constructor(editor: EditorInterface) {
    this.editor = editor
  }
  accept(inputType: string, event?: InputEvent): boolean {
    const { editor } = this
    const { selection } = editor
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
    const { editor } = this
    const { selection } = editor
    const { focusOffset, focusBlock } = selection;
    if (
      focusOffset === 0 &&
      inputType.startsWith("delete") &&
      focusBlock.parent.type === "list_item" &&
      focusBlock.parent.blocks.indexOf(focusBlock) === 0 &&
      selection.type === "Caret"
    ) {
      const preBlock = editor.getPreviousBlock(focusBlock.parent);
      if (preBlock.blocks.length === 1 && preBlock.blocks[0].text === "") {
        editor.model.deleteBlock(preBlock.blocks[0].id);
      }
      editor.model.mergeBlock(preBlock, focusBlock.parent);
      editor.model.deleteBlock(focusBlock.parent.id);
    }
    if (inputType === "insertParagraph") {
      if (focusBlock.parent.blocks.indexOf(focusBlock) === 0) {
        if (focusBlock.text === "" && focusBlock.parent.blocks.length === 1) {
          if (
            focusBlock.parent.parent.blocks.indexOf(focusBlock.parent) ===
            focusBlock.parent.parent.blocks.length - 1
          ) {
            editor.model.deleteBlock(focusBlock.parent.id);
            editor.model.insertAfter(focusBlock.parent.parent, focusBlock);
            return;
          }
        }

        const newBlock = editor.createListItemBlock(
          editor.createParagraphBlock(focusBlock.text.slice(0, focusOffset)),
          focusBlock.parent.task,
          focusBlock.parent.checked
        );
        const text = focusBlock.text.slice(focusOffset);
        editor.model.updateBlock(focusBlock, { text });
        editor.model.insertBefore(focusBlock.parent, newBlock);
        selection.collapse(focusBlock);
      }

      if (
        focusBlock.text === "" &&
        focusBlock.parent.blocks.indexOf(focusBlock) + 1 ===
          focusBlock.parent.blocks.length
      ) {
        editor.model.insertAfter(
          focusBlock.parent,
          editor.createListItemBlock(
            focusBlock,
            focusBlock.parent.task,
            focusBlock.parent.checked
          )
        );
        editor.model.deleteBlock(focusBlock.id);
      }
    }
  }
}
