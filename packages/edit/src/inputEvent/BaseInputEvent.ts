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
  execute(inputType: string, event?: InputEvent): void {
    const { editor } = this
    if (inputType.startsWith('delete')) {
      editor.model.deleteContent(event.getTargetRanges()[0]);
    }
    if (inputType === 'insertText') {
      editor.model.deleteContent(event.getTargetRanges()[0]);
      editor.model.insertText(event.data);
    }
    if (inputType === 'insertParagraph') {
      editor.model.deleteContent(event.getTargetRanges()[0]);
      editor.model.insertParagraph();
    }
    if (inputType === 'insertFromPaste') {
      const { clipboard } = editor;
      editor.model.deleteContent(event.getTargetRanges()[0]);
      clipboard.getData().then(blocks => blocks && editor.model.insertBlocks(blocks));
    }
    if (inputType === 'insertFromDrop'){
      const { clipboard } = editor;
      clipboard.addData(event.dataTransfer)  
      const { startContainer,  startOffset } = editor.range(event.getTargetRanges()[0])  
      editor.selection.collapse(startContainer, startOffset)
      clipboard.getData().then(blocks => blocks && editor.model.insertBlocks(blocks))
    }
    
  }
}
