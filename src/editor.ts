import { selection, SelectionInterface } from "./selection";
import { createUpdateOperation, createDelOperation } from "./operation";
import { Block } from "./block";
import { BlockInterface, createModel, Model } from "./model";
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

function ConvertBlock(block: BlockInterface) {
  const { model } = editor;
  if (block.type === "heading" || block.type === "paragraph") {
    // heading
    if (/^(#+)\s(.*)/.test(block.text)) {
      const newBlock = Block.createHeading(block.text);
      selection.focusOffset -= newBlock.depth;
      model.replaceBlock(block, newBlock);
      selection.collapse(newBlock);
    }

    if (/^[+]{0,1}(\d+)\.\s/.test(block.text)) {
      const start = block.text.split(".")[0];
      const newBlock = Block.createListBlock(block, true, Number(start));
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
      const newBlock = Block.createListBlock(block);
      // block.text = block.text.replace("- ", "");
      selection.focusOffset -= 2;
      model.updateBlock(block, { text: block.text.replace("- ", "") });
      model.replaceBlock(block, newBlock);
      selection.collapse(newBlock);
    }
    // quote
    if (block.text.startsWith("> ")) {
      const newBlock = Block.createBlockquoteBlock(block);
      selection.focusOffset -= 2;
      model.updateBlock(block, { text: block.text.replace("> ", "") });
      model.replaceBlock(block, newBlock);
      selection.collapse(newBlock);
    }

    // hr
    if (block.text.startsWith("---")) {
      selection.collapse(Block.getNextTextBlock(block.id));
      model.replaceBlock(block, Block.createHrBlock());
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

//

export class Editor {
  model: Model;
  selection: SelectionInterface;
  inputStrategys: InputEventStrategy[] = [];
  history: History;
  idToBlock = new Map();
  constructor() {
    this.history = new History(this);
    this.model = createModel(this, parseMD());
    this.selection = selection;
    this.inputStrategys.push(new BaseInputEvent());
    this.inputStrategys.push(new BlockquoteInputEvent());
    this.inputStrategys.push(new ListInputEvent());
    this.inputStrategys.push(new CodeInputEvent());
    this.inputStrategys.push(new TableInputEvent());

    Event.on("block-change", this.blockChange.bind(this));
  }

  blockChange(block: BlockInterface) {
    ConvertBlock(block);
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

  pasteContnet = [];
  onPaste = (event: ClipboardEvent) => {
    const { clipboardData } = event;
    console.log("onPaste", event.clipboardData.types);
    if (clipboardData.types.includes("text/html")) {
      // this.model.deleteContent()
      this.pasteContnet = HtmlToModel(clipboardData.getData("text/html"));
      return;
    } else if (clipboardData.types.includes("text/plain")) {
      this.pasteContnet = parseMD(clipboardData.getData("text/plain")).blocks;
    }
    // HtmlToModel
  };
  onBeforeInput = (event: InputEvent) => {
    const { inputType } = event;
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
      const { focusBlock } = editor.selection;

      if (
        /^\`{3,10}/.test(focusBlock.text) &&
        focusBlock.type === "paragraph"
      ) {
        const newBlock = Block.createCodeBlock(
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
    this.compositionOffset = selection.focusOffset;
  };
  onCompositionupdate = () => {};
  onCompositionend = (event: CompositionEvent) => {
    this.isComposing = false;
    console.log("onDomCompositionend", event.data);
    selection.focusOffset = this.compositionOffset;
    this.model.insertText(event.data);
  };
}

export const editor = new Editor();
// @ts-ignore
window.editor = editor;

// export let index = 0;
// export const idToBlock = {};

// export const editor = createEditor({ model: formatRoot(tokens) });
// window.editor = editor;
