// import {  editor } from 'src/editor';
import {  InputEventStrategy } from '.';
import {  EditorInterface } from '../editor';

export class BaseInputEvent implements InputEventStrategy {
  editor: EditorInterface
  constructor(editor: EditorInterface) {
    this.editor = editor
  }
  accept(inputType: string, event?: InputEvent) {
    return true;
  }
  execute(inputType: string, event?: InputEvent): boolean {
    const { editor } = this
    const range = editor.range(event.getTargetRanges()[0]) 
    if(range.startContainer.type === 'hr'){
      const p = editor.createParagraphBlock()
      editor.model.replaceBlock(range.startContainer, p)
      editor.model.normalize(range.startContainer.parent)
      range.startContainer = p
    }
    if (inputType.startsWith('delete')) {
      if(editor.selection.focusOffset === 0 && editor.selection.type === 'Caret'){
        let pre = editor.getPreviousTextBlock(editor.selection.focusBlock.id)
        if(pre.type === 'hr'){
          const p = editor.createParagraphBlock()
          editor.model.replaceBlock(pre, p)
          editor.model.normalize(pre.parent)
          pre = p
        }
        range.startContainer = pre
        range.startOffset = pre.text?.length || 0
      }
      editor.model.deleteContent(range);
    }
    if (inputType === 'insertText') {
      editor.model.deleteContent(range);
      editor.model.insertText(event.data);
    }
    if (inputType === 'insertParagraph') {
      editor.model.deleteContent(range);
      editor.model.insertParagraph();
    }
    if (inputType === 'insertFromPaste') {
      const { clipboard } = editor;
      editor.model.deleteContent(range);
      clipboard.getData().then(blocks => blocks && editor.model.insertBlocks(blocks));
    }
    if (inputType === 'insertFromDrop'){
      const { clipboard } = editor;
      clipboard.addData(event.dataTransfer)  
      const { startContainer, startOffset } = editor.range(range)  
      editor.selection.collapse(startContainer, startOffset)
      clipboard.getData().then(blocks => blocks && editor.model.insertBlocks(blocks))
    }
    
    return true
  }
}
