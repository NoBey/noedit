import { Selection, SelectionInterface } from "./selection";
// import { BlockUtil } from "./block"; 
import { BlockInterface, Model, ModelInterface } from "./model";
import { HtmlToModel, parseMD } from "./parse";
import { Event } from "./Event";
import {
  BaseInputEvent,
  BlockquoteInputEvent,
  InputEventStrategy,
  ListInputEvent,
  CodeInputEvent,
  TableInputEvent,
} from "./inputEvent";
import { History } from "./history";
import { iterationTextNode } from "./utils";
import { marked } from "marked";
import { clipboard, ClipboardInterface } from "./clipboard";

function ConvertBlock(editor: EditorInterface, block: BlockInterface) {
  const { model, selection } = editor;
  if (block.type === "heading" || block.type === "paragraph") {
    // heading
    if (/^(#+)\s(.*)/.test(block.text)) {
      const newBlock = editor.createHeading(block.text);
      selection.focusOffset -= newBlock.depth;
      model.replaceBlock(block, newBlock);
      selection.collapse(newBlock);
    }

    if (/^[+]{0,1}(\d+)\.\s/.test(block.text)) {
      const start = block.text.split(".")[0];
      const newBlock = editor.createListBlock(block, true, Number(start));
      // block.text = block.text.replace("- ", "");
      selection.focusOffset -= start.length + 1;
      model.updateBlock(block, {
        text: block.text.replace(/^[+]{0,1}(\d+)\.\s/, ""),
      });
      model.replaceBlock(block, newBlock);
      selection.collapse(newBlock);
    }

    // ul
    if (/^[\\s]*[-\\*\\+] +(.*)/.test(block.text)) {
      const newBlock = editor.createListBlock(block);
      // block.text = block.text.replace("- ", "");
      selection.focusOffset -= 2;
      model.updateBlock(block, { text: block.text.replace("- ", "") });
      model.replaceBlock(block, newBlock);
      selection.collapse(newBlock);
    }
    // quote
    if (block.text.startsWith("> ")) {
      const newBlock = editor.createBlockquoteBlock(block);
      selection.focusOffset -= 2;
      model.updateBlock(block, { text: block.text.replace("> ", "") });
      model.replaceBlock(block, newBlock);
      selection.collapse(newBlock);
    }

    // hr
    if (block.text.startsWith("---")) {
      selection.collapse(editor.getNextTextBlock(block.id));
      model.replaceBlock(block, editor.createHrBlock());
    }

    // task
    if (/^\[[\s,x]\]/.test(block.text)) {
      if (
        block.parent.type === "list_item" &&
        block.parent.blocks.indexOf(block) === 0
      ) {
        selection.focusOffset -= 2;
        model.updateBlock(block.parent, {
          task: true,
          checked: block.text.startsWith("[x]"),
        });
        model.updateBlock(block, {
          text: block.text.replace(/^\[[\s,x]\]/, ""),
        });
      }
    }
  }
}


//\\
export interface EditorInterface extends Editor {}

export class Editor {
  model: ModelInterface;
  selection: SelectionInterface;
  clipboard : ClipboardInterface
  inputStrategys: InputEventStrategy[] = [];
  history: History;
  idToBlock: Map<string | number, BlockInterface> = new Map();
  idToDom = new Map();
  DomToBlock = new WeakMap();
  container: HTMLDivElement

  get textPath(){
    const list = []
    const stack: BlockInterface[] = [this.model._model]
    while (stack.length) {
      let block = stack.pop()
      if( ['paragraph','heading', 'code'].includes(block.type)){
         list.push(block.id)
      }
      stack.push(...([...block.blocks||[]]).reverse())
    }
    return list
  }

  constructor() {
    this.history = new History(this);
    this.model = new Model(this, parseMD());
    this.selection = new Selection(this);
    this.clipboard = new clipboard()

    this.inputStrategys.push(new BaseInputEvent(this));
    this.inputStrategys.push(new BlockquoteInputEvent(this));
    this.inputStrategys.push(new ListInputEvent(this));
    this.inputStrategys.push(new CodeInputEvent(this));
    this.inputStrategys.push(new TableInputEvent(this));

    Event.on("block-change", this.blockChange.bind(this));
  }

  blockChange(block: BlockInterface) {
    if(block?.parent?.type !== 'table') ConvertBlock(this, block);
  }
  applyInputStrategys(inputType: string, Event: InputEvent) {
    const strategys = [...this.inputStrategys];
    while (strategys.length) {
      const strategy = strategys.pop();
      if (strategy.accept(inputType, Event)) {
        return strategy.execute(inputType, Event);
      }
    }
  }

  onPaste = (event: ClipboardEvent) => {
    const { clipboardData } = event;
    this.clipboard.addData(clipboardData)
  };
  onBeforeInput = (event: InputEvent) => {
    const { inputType } = event;
    console.log({inputType})
    // if(this.selection.focusBlock.type === "code") return
    if (
      this.isComposing ||
      inputType === "insertCompositionText" ||
      inputType === "deleteCompositionText"
    ) {
      return;
    }
    if (inputType === "insertParagraph") {
      // insertParagraph 之后
      const { focusBlock } = this.selection;

      if (
        focusBlock.text.trimEnd() === "$$" &&
        focusBlock.type === "paragraph"
      ) {
        const newBlock = this.createCodeBlock( "math", "");
        this.model.replaceBlock(focusBlock, newBlock);

        this.selection.collapse(newBlock);
        event.preventDefault();

        return;
      }

      if (
        /^\`{3,10}/.test(focusBlock.text) &&
        focusBlock.type === "paragraph"
      ) {
        const newBlock = this.createCodeBlock(
          focusBlock.text.replace(/^\`{3,10}/, "")
        );
        this.model.replaceBlock(focusBlock, newBlock);

        this.selection.collapse(newBlock);
        event.preventDefault();

        return;
      }
    }
    // console.log('onPaste', event.dataTransfer )
    this.applyInputStrategys(inputType, event);

    // event.stopPropagation()
    event.preventDefault();
    return;
  };
  isComposing = false;
  compositionOffset: number;
  onCompositionstart = () => {
    this.isComposing = true;
    this.compositionOffset = this.selection.focusOffset;
  };
  onCompositionupdate = () => {};
  onCompositionend = (event: CompositionEvent) => {
    this.isComposing = false;
    console.log("onDomCompositionend", event.data);
    this.selection.focusOffset = this.compositionOffset;
    this.model.insertText(event.data);
  };


  domToBlock(domNode) {
    const { DomToBlock } = this
    while (domNode && !DomToBlock.get(domNode)) {
      domNode = domNode.parentNode;
    }
    return DomToBlock.get(domNode);
  }
  fixOffset(node: Node, offset: number = 0) {
    const { DomToBlock } = this
    let parent = node;
    while (parent && !DomToBlock.get(parent)) parent = parent.parentNode;
    if (parent === node) return { node, offset, block: DomToBlock.get(node) };
    for (let tnode of iterationTextNode(parent)) {
      if (tnode === node) break;
      offset += tnode.length;
    }
    return { node: parent, offset, block: DomToBlock.get(parent) };
  }
  range(range) {
    const { endContainer, startContainer, endOffset, startOffset } = range;
    const start = this.fixOffset(startContainer, startOffset);
    const end = this.fixOffset(endContainer, endOffset);
    return {
      endOffset: end.offset,
      startOffset: start.offset,
      startContainer: start.block,
      endContainer: end.block,
    };
  }
  contains(parentBlocks: BlockInterface, block: BlockInterface) {
    if (!parentBlocks.blocks) return false;
    for (let b of parentBlocks.blocks) {
      if (b === block || this.contains(b, block)) return true;
    }
    return false;
  }

  getCommonBlock(block1?: BlockInterface, block2?: BlockInterface){
    if (!block1 || !block2) return null;
    if (this.contains(block1, block2)) {
      return block1;
    } else {
      return this.getCommonBlock(block1.parent, block2); // 递归的使用
    }
  }
  getDomByid (id){
    return  this.idToDom.get(id)
  }
  getBlockByid(id): BlockInterface{
    return this.idToBlock.get(id)
  }

  getTextByid(id)  {
    let node = this.idToDom.get(id);
    while (node && !["#text", "BR"].includes(node.nodeName)) {
      node = node.firstChild;
    }
    return node;
  }
  createParagraphBlock(text = ""): BlockInterface {
    return {
      blocks: [],
      isBlock: true,
      text,
      type: "paragraph",
    };
  }
  createHrBlock(text = "") {
    return {
      blocks: [],
      isBlock: true,
      type: "hr",
    };
  }
  createCodeBlock(lang = "", text = "") {
    return { lang, raw: "", text, type: "code" };
  }
  createBlockquoteBlock(block) {
    return {
      blocks: [block],
      isBlock: true,
      type: "blockquote",
    };
  }
  createListItemBlock(block, task = false, checked = false) {
    return {
      blocks: [block],
      isBlock: true,
      task,
      checked,
      type: "list_item",
    };
  }
  createListBlock(block, ordered = false, start = 1) {
    return {
      blocks: [this.createListItemBlock(block)],
      isBlock: true,
      type: "list",
      ordered: ordered,
      start,
    };
  }
  createHeading(text = "# ") {
    return { ...marked.lexer(text)[0], blocks: [] } as BlockInterface;
  }
  getPreviousBlock(block: BlockInterface) {
    const index = block.parent.blocks.indexOf(block);
    return index === 0 ? block.parent : block.parent.blocks[index - 1];
  }
  getNextBlock(block: BlockInterface) {
    if (!block) return null;
    const index = block.parent.blocks.indexOf(block);
    return index === block.parent.blocks.length - 1
      ? this.getNextBlock(block.parent) || block
      : block.parent.blocks[index + 1];
  }
  getPreviousTextBlock(id) {
    const { textPath } = this
    let index = textPath.indexOf(id);
    return this.getBlockByid(index === 0 ? id : textPath[index - 1]);
  }
  getNextTextBlock(id) {
    const { textPath } = this
    let index = textPath.indexOf(id);
    return this.getBlockByid(index === textPath.length - 1 ? id : textPath[index + 1]);
  }
  isTextBlock(id) {
    const { textPath } = this
    return textPath.includes(id);
  }
  addLastLine(){
    const { textPath } = this
    let lastBlock = this.getBlockByid(textPath[textPath.length-1])
    while(lastBlock && lastBlock.parent.type !== 'root'){
      lastBlock = lastBlock.parent
    }
    this.model.insertAfter(lastBlock, this.createParagraphBlock())
  }

  setMarkDown(md: string = ''){
    this.model.setModel(parseMD(md))
  }
}

// export const editor = new Editor();
// @ts-ignore
// window.editor = editor;

// export let index = 0;
// export const idToBlock = {};

// export const editor = createEditor({ model: formatRoot(tokens) });
// window.editor = editor;
