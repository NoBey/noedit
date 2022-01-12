import { InputEventStrategy } from ".";
import { EditorInterface } from "../editor";

export class HeadingInputEvent implements InputEventStrategy {
  editor: EditorInterface
  constructor(editor: EditorInterface) {
    this.editor = editor
  }
  accept(inputType: string, event?: InputEvent) {
    const { editor } = this
    if (inputType.startsWith("delete") && editor.selection.type === "Caret" && editor.selection.focusBlock.type === "heading" && editor.selection.focusOffset === 0) {
      return true
    }
    return false;
  }
  execute(inputType: string, event?: InputEvent): boolean {
    const { editor } = this
    if (inputType.startsWith("delete")) {
      const newBlock = editor.createParagraphBlock(editor.selection.focusBlock.text)
      editor.model.replaceBlock(editor.selection.focusBlock, newBlock);
      editor.selection.collapse(newBlock)
    }
    return true
  }
}
