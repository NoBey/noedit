import { selection, SelectionInterface } from "./selection";
import { createUpdateOperation, createDelOperation } from "./operation";
import { Block } from "./block";
import { BlockInterface, createModel, Model } from "./model";
import { parseMD } from "./parse";
import { Event } from "./Event";
import {
  BaseInputEvent,
  BlockquoteInputEvent,
  InputEventStrategy,
  ListInputEvent,
} from "./inputEvent";
import { History } from "./history";

export class Editor {
  model: Model;
  selection: SelectionInterface;
  inputStrategys: InputEventStrategy[] = [];
  history: History
  idToBlock = new Map();
  constructor() {
    this.history = new History(this)
    this.model = createModel(this, parseMD());
    this.selection = selection;
    this.inputStrategys.push(new BaseInputEvent());
    this.inputStrategys.push(new BlockquoteInputEvent());
    this.inputStrategys.push(new ListInputEvent());

    Event.on("block-change", this.blockChange.bind(this));
  }

  blockChange(block: BlockInterface) {
    console.log("blockChange", block.type, block);
    const { model } = this;
    if (block.text.startsWith("- ")) {
      const newBlock = Block.createListBlock(block);
      // block.text = block.text.replace("- ", "");
      selection.focusOffset -= 2;
      model.updateBlock(block, { text: block.text.replace("- ", "") });
      model.replaceBlock(block, newBlock);

      selection.collapse(newBlock);
    }
    if (block.text.startsWith("> ")) {
      const newBlock = Block.createBlockquoteBlock(block);
      // block.text = block.text.replace("> ", "");
      selection.focusOffset -= 2;
      model.updateBlock(block, { text: block.text.replace("> ", "") });
      model.replaceBlock(block, newBlock);

      selection.collapse(newBlock);
    }
    if (block.text.startsWith("---")) {
      selection.collapse(Block.getNextTextBlock(block.id));
      model.replaceBlock(block, Block.createHrBlock());
    }
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

  onBeforeInput = (event: InputEvent) => {
    const { inputType } = event;

    if (
      this.isComposing ||
      inputType === "insertCompositionText" ||
      inputType === "deleteCompositionText"
    ) {
      return;
    }
    console.log(inputType, event.getTargetRanges());
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
