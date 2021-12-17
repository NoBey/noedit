import { Block } from "./block";
import { BlockInterface } from "./model";
import { iterationTextNode } from "./utils";

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
    // const dom = Block.getTextByid(block.id);
    // dom && this.selection.collapse(dom, dom.nodeName === "BR" ? 0 : offset);
  }
  reset() {
    const { focusBlock, focusOffset } = this;
    const dom = Block.getDomByid(focusBlock.id)
    let offset = focusOffset
    for(let tnode of iterationTextNode(dom)) {
      if(tnode.length >= offset){
        return this.selection.collapse(tnode, offset);
      }else{
        offset -= tnode.length
      }
    }
    this.selection.collapse(Block.getTextByid(focusBlock.id), focusOffset);
  }
  focusInline({ focusNode }){
    
    Array.from(document.querySelectorAll('.inline-focus')).forEach(dom => {
      dom.classList.remove('inline-focus')
    });

    let node = focusNode
    while(!node?.dataset?.type){
      if(node?.classList?.contains('inline')){
        node?.classList.add('inline-focus')
      }
      node = node.parentElement
    }
  }
  change() {
    const { selection } = this;
    // console.log('change', selection)

    if(selection.type === 'Caret') this.focusInline(selection)

    const anchor = Block.fixOffset(selection.anchorNode, selection.anchorOffset)
    const focus = Block.fixOffset(selection.focusNode, selection.focusOffset)
    
    this.anchorBlock = anchor.block
    this.anchorOffset = anchor.offset
    this.focusBlock = focus.block
    this.focusOffset = focus.offset

    this.type = selection.type;
    // console.log(selection.anchorNode);
    this.range = null;
    if (selection.type === "Range") {
      const _range = selection.getRangeAt(0);
      const { startContainer, startOffset, endContainer, endOffset } = Block.range(_range)
      this.range = _range;
      this.startOffset = startOffset;
      this.endOffset = endOffset;
      this.startContainer = startContainer;
      this.endContainer = endContainer
      this.commonAncestor = Block.domToBlock(_range.commonAncestorContainer);
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
// window.selection = selection;
