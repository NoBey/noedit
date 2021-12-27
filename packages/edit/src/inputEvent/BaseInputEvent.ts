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
      const { pasteContnet } = editor;
      editor.model.deleteContent(event.getTargetRanges()[0]);
      editor.model.insertBlocks(pasteContnet);
      editor.pasteContnet = [];
    }
  }
}
