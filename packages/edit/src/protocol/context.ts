import { Editor } from './editor';
import EventEmitter from 'eventemitter3';

class Context {
  public editor: Editor;
  public eventCenter: EventEmitter;
  constructor(editor: Editor, eventCenter: EventEmitter<string | symbol, any>) {
    this.editor = editor;
    this.eventCenter = eventCenter;
  }
}
export default Context;
