import { idToDom, DomToBlock } from "./view";
import { BlockInterface } from "./model";
import { path } from "./view";
import { editor } from "./editor";
import { iterationTextNode } from "./utils";
import { marked } from "marked";

// interface Range {
//   collapsed: boolean;
//   endContainer: HTMLElement;
//   endOffset: number;
//   startContainer: HTMLElement;
//   startOffset: number;
// }

const Block = {
  domToBlock(domNode) {
    while (domNode && !DomToBlock.get(domNode)) {
      domNode = domNode.parentNode;
    }
    return DomToBlock.get(domNode);
  },
  fixOffset(node: Node, offset: number = 0){
    let parent = node
    while( parent && !DomToBlock.get(parent)) parent = parent.parentNode
    if(parent === node) return { node, offset, block: DomToBlock.get(node) }
    for (let tnode of iterationTextNode(parent)) {
      if(tnode === node) break
      offset += tnode.length
    }
    return { node: parent, offset, block: DomToBlock.get(parent) }
  },
  range(range) {
    const { endContainer, startContainer, endOffset, startOffset } = range;
    const start = Block.fixOffset(startContainer, startOffset)
    const end = Block.fixOffset(endContainer, endOffset)
    return {
      endOffset: end.offset,
      startOffset: start.offset,
      startContainer: start.block,
      endContainer: end.block,
    };
  },
  contains(parentBlocks: BlockInterface, block: BlockInterface){
    if(!parentBlocks.blocks) return false
    for(let b of parentBlocks.blocks){
      if(b === block || Block.contains(b, block)) return true
    }
    return false
  },
  getCommonBlock: (block1?: BlockInterface, block2?: BlockInterface) => {
    if (!block1 || !block2) return null;
    if (Block.contains(block1, block2)) {
      return block1;
    } else {
      return Block.getCommonBlock(block1.parent, block2); // 递归的使用
    }
  },
  getDomByid: (id) => idToDom.get(id),
  getBlockByid: (id): BlockInterface => editor.idToBlock.get(id),
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
      type: "paragraph",
    };
  },
  createHrBlock(text = "") {
    return {
      blocks: [],
      isBlock: true,
      type: "hr",
    };
  },
  createBlockquoteBlock(block) {
    return {
      blocks: [block],
      isBlock: true,
      type: "blockquote",
    };
  },
  createListItemBlock(block) {
    return {
      blocks: [block],
      isBlock: true,
      type: "list_item",
    };
  },
  createListBlock(block) {
    return {
      blocks: [Block.createListItemBlock(block)],
      isBlock: true,
      type: "list",
    };
  },
  createHeading(text = '# ') {
    return {...marked.lexer(text)[0], blocks: []} as BlockInterface;
  },
  getPreviousBlock(block: BlockInterface) {
    const index = block.parent.blocks.indexOf(block)
    return index === 0 ? block.parent : block.parent.blocks[index - 1]
  },
  getNextBlock(block: BlockInterface) {
    if(!block) return null
    const index = block.parent.blocks.indexOf(block)
    return index === (block.parent.blocks.length - 1) ? Block.getNextBlock(block.parent) || block  : block.parent.blocks[index + 1]
  },
  getPreviousTextBlock(id) {
    let index = path.indexOf(id);
    return Block.getBlockByid(index === 0 ? id : path[index - 1]);
  },
  getNextTextBlock(id) {
    let index = path.indexOf(id);
    return Block.getBlockByid(index === path.length-1 ? id : path[index + 1]);
  },
  isTextBlock(id) {
    return path.includes(id);
  },
};

// @ts-ignore
window.Block = Block;
export { Block };
