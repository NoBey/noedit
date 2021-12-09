import { idToDom, DomToBlock } from "./view";
import { idToBlock } from "./model";
import { path } from "./view";

const Block = {
  domToBlock(domNode) {
    while (domNode && !DomToBlock.get(domNode)) {
      domNode = domNode.parentNode;
    }
    return DomToBlock.get(domNode);
  },
  getDomByid: (id) => idToDom.get(id),
  getBlockByid: (id) => idToBlock.get(id),
  getTextByid: (id) => {
    let node = idToDom.get(id);
    while (node && !["#text", "BR"].includes(node.nodeName)) {
      node = node.firstChild;
    }
    return node;
  },
  createParagraphBlock(text = "") {
    return {
      blocks: [],
      isBlock: true,
      text,
      type: "paragraph"
    };
  },
  createBlockquoteBlock(block) {
    return {
      blocks: [block],
      isBlock: true,
      type: "blockquote"
    };
  },
  createListItemBlock(block) {
    return {
      blocks: [block],
      isBlock: true,
      type: "list_item"
    };
  },
  createListBlock(block) {
    return {
      blocks: [Block.createListItemBlock(block)],
      isBlock: true,
      type: "list"
    };
  },
  getPreviousTextBlock(id) {
    let index = path.indexOf(id);
    return Block.getBlockByid(index === 0 ? id : path[index - 1]);
  },
  isTextBlock(id) {
    return path.includes(id);
  }
};

// @ts-ignore
window.Block = Block;
export { Block };
