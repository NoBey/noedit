import { BlockInterface } from './model';
import { HtmlToModel, parseMD } from './parse';

export interface ClipboardInterface extends clipboard {}

export class clipboard {
  contnet: BlockInterface[];
  addData(dataTransfer: DataTransfer) {
    if (dataTransfer.types.includes('text/html')) {
      this.contnet = HtmlToModel(dataTransfer.getData('text/html'));
      return;
    } else if (dataTransfer.types.includes('text/plain')) {
      const text = dataTransfer.getData('text/plain');
      console.log('onPaste', text);
      this.contnet = parseMD(text).blocks;
    }
  }
  getData() {
    const { contnet } = this;
    this.contnet = null;
    return contnet;
  }
}
