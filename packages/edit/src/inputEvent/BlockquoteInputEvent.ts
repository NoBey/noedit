
import { InputEventStrategy } from ".";
import { EditorInterface } from "../editor";

export class BlockquoteInputEvent implements InputEventStrategy {
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
        focusBlock.parent.type === "blockquote" &&
        focusBlock.parent.blocks.indexOf(focusBlock) === 0 && 
        selection.type === "Caret"
      ) {
        return true
      }
  
      if (
        focusBlock.text === "" &&
        inputType === "insertParagraph" &&
        focusBlock.parent.type === "blockquote" &&
        selection.type === "Caret"
      ) {
        //focusBlock.parent.blocks.indexOf(focusBlock) + 1 === focusBlock.parent.blocks.length
        return true 
      }
  
      return false;
    }
    execute(inputType: string, event?: InputEvent): boolean {
      const { editor } = this
      const { selection } = editor
      const { focusOffset, focusBlock } = selection;
      if (
        focusOffset === 0 &&
        inputType.startsWith("delete") &&
        focusBlock.parent.type === "blockquote" &&
        focusBlock.parent.blocks.indexOf(focusBlock) === 0
      ) {
        editor.model.deleteBlock(focusBlock.id)
        editor.model.insertBefore(focusBlock.parent, focusBlock);
        return true
      }
  
      if (
        focusBlock.text === "" &&
        inputType === "insertParagraph" &&
        focusBlock.parent.type === "blockquote" &&
        selection.type === "Caret"
      ) {
        // 首行退出
        if(focusBlock.parent.blocks.indexOf(focusBlock) === 0){
          editor.model.deleteBlock(focusBlock.id)
          editor.model.insertBefore(focusBlock.parent, focusBlock)
          return true
        }

        // 尾部退出
        if(focusBlock.parent.blocks.indexOf(focusBlock) + 1 === focusBlock.parent.blocks.length){
          editor.model.deleteBlock(focusBlock.id)
          editor.model.insertAfter(focusBlock.parent, focusBlock)
          return true
        }

        // 分割
        editor.model.splitBlockquote(focusBlock.parent, focusBlock.parent.blocks.indexOf(focusBlock))
        editor.model.deleteBlock(focusBlock.id)
        editor.model.insertAfter(focusBlock.parent, focusBlock)

        return true
      }
      return true
    }
  }