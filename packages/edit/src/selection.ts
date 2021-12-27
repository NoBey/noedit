import { BlockUtil } from "./block";
import { openTooltip } from "./component";
import { BlockInterface } from "./model";
import { getKatexHtml, iterationTextNode } from "./utils";

export interface SelectionInterface extends Selection {}

export class Selection {
  selection = window.getSelection();
  anchorBlock?: BlockInterface;
  anchorOffset?: number;
  focusOffset?: number;
  focusBlock?: BlockInterface;
  commonAncestor?: BlockInterface;
  range: Range = null;
  type = "None";
  startContainer?: BlockInterface;
  endContainer?: BlockInterface;
  startOffset?: number;
  endOffset?: number;
  skipSelectionchange = false;

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
    let { focusBlock, focusOffset } = this;
    if (this.type === "None") return;
    this.skipSelectionchange = true;
    const dom = BlockUtil.getDomByid(focusBlock.id);
    let offset = focusOffset;
    for (let tnode of iterationTextNode(dom)) {

      if (tnode.length >= offset) {
        return this.selection.collapse(tnode, offset);
      } else {
        offset -= tnode.length;
      }
    }
    const text = BlockUtil.getTextByid(focusBlock.id);
    if (text?.nodeName === "#text" && focusOffset > text.length)
      focusOffset = text.length;
    this.selection.collapse(text, focusOffset);
  }
  focusInline({ focusNode }) {
    Array.from(document.querySelectorAll(".inline-focus")).forEach((dom) => {
      dom.classList.remove("inline-focus");
    });

    let node = focusNode;
    while (node && !node?.dataset?.type) {
      if(node?.classList?.contains('inline-math')){
        const text = node.querySelector('.inline-meta').innerText
        text && openTooltip(node, getKatexHtml(text))
      }
      if (node?.classList?.contains("inline")) {
        node?.classList.add("inline-focus");
      }
      node = node.parentElement;
    }
  }
  focusCode({ focusNode }) {
    const block = BlockUtil.domToBlock(focusNode);
    Array.from(document.querySelectorAll(".md-code-focus")).forEach((dom) => {
      dom.classList.remove("md-code-focus");
    });
    if (block.type === "code") {
      console.log("code");
      BlockUtil.getDomByid(block.id)?.classList.add("md-code-focus");
    }
  }

  change() {
    const { selection } = this;

    console.log("change", selection);

    if (selection.type === "Caret") {
      this.focusInline(selection);
      this.focusCode(selection);
    }

    const anchor = BlockUtil.fixOffset(
      selection.anchorNode,
      selection.anchorOffset
    );
    const focus = BlockUtil.fixOffset(selection.focusNode, selection.focusOffset);
    if (this.skipSelectionchange) {
      this.skipSelectionchange = false;
      if (this.focusBlock === focus.block) return;
    }
    this.anchorBlock = anchor.block;
    this.anchorOffset = anchor.offset;
    this.focusBlock = focus.block;
    this.focusOffset = focus.offset;

    this.type = selection.type;

    this.range = null;
    if (selection.type === "Range") {
      const _range = selection.getRangeAt(0);
      const { startContainer, startOffset, endContainer, endOffset } =
      BlockUtil.range(_range);
      this.range = _range;
      this.startOffset = startOffset;
      this.endOffset = endOffset;
      this.startContainer = startContainer;
      this.endContainer = endContainer;
      this.commonAncestor = BlockUtil.domToBlock(_range.commonAncestorContainer);
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

// export const selection = new Selection();
// @ts-ignore
// window.selection = selection;
