import { InputEventStrategy } from ".";
import { EditorInterface } from "../editor";

export class HrInputEvent implements InputEventStrategy {
  editor: EditorInterface
  constructor(editor: EditorInterface) {
    this.editor = editor
  }
  accept(inputType: string, event?: InputEvent) {
    const { editor } = this
    if (inputType.startsWith("delete") && editor.selection.type === "Caret" && editor.selection.focusBlock.type === "hr") {
      return true
    }
    return false;
  }
  execute(inputType: string, event?: InputEvent): void {
    const { editor } = this
    if (inputType.startsWith("delete")) {
      const newBlock = editor.createParagraphBlock()
      editor.model.replaceBlock(editor.selection.focusBlock, newBlock);
      editor.selection.collapse(newBlock)
    }
  }
}
