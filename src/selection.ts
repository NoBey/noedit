import { Block } from "./block";
import { BlockInterface } from "./model";

export interface SelectionInterface extends Selection{}

 class Selection {
  selection = window.getSelection();
  anchorBlock?: BlockInterface;
  anchorOffset?: number
  focusOffset?: number
  focusBlock?: BlockInterface;
  commonAncestor?: BlockInterface;
  range: Range = null;
  type = "None";
  startContainer?: BlockInterface;
  endContainer?: BlockInterface;
  startOffset?: number
  endOffset?: number

  constructor() {
    document.addEventListener("selectionchange", this.change.bind(this));
  }

  collapse(block, offset = 0) {
    this.focusBlock = block;
    this.focusOffset = offset;
    const dom = Block.getTextByid(block.id);
    // dom && this.selection.collapse(dom, dom.nodeName === "BR" ? 0 : offset);
  }
  reset() {
    const { focusBlock, focusOffset } = this;
    this.selection.collapse(Block.getTextByid(focusBlock.id), focusOffset);
  }

  change() {
    const { selection } = this;
    console.log('change', selection)

    this.anchorBlock = Block.domToBlock(selection.anchorNode);
    this.focusBlock = Block.domToBlock(selection.focusNode);
    this.type = selection.type;
    this.anchorOffset = selection.anchorOffset;
    this.focusOffset = selection.focusOffset;
    // console.log(selection.anchorNode);
    this.range = null;
    if (selection.type === "Range") {
      const range = selection.getRangeAt(0);
      this.range = range;
      this.startOffset = range.startOffset;
      this.endOffset = range.endOffset;
      this.startContainer = Block.domToBlock(range?.startContainer);
      this.endContainer = Block.domToBlock(range?.endContainer);
      this.commonAncestor = Block.domToBlock(range.commonAncestorContainer);
    }
    // if(this.focusBlock.type === "code"){
    //   document.querySelector('#root').setAttribute('contentEditable', 'false')
    //   // contentEditable
    // }else{
    //   document.querySelector('#root').setAttribute('contentEditable', 'true')
    // }
  }
  // setRange() {}
}

export const selection = new Selection();
// @ts-ignore
window.selection = selection;
