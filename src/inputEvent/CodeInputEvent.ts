import { editor } from "src/editor";
import { InputEventStrategy } from ".";

export class CodeInputEvent implements InputEventStrategy {
    accept(inputType: string, event?: InputEvent) {
      if(inputType==="insertParagraph" && editor.selection.focusBlock.type === "code"){
        return true
      }
      return false;
    }
    execute(inputType: string, event?: InputEvent): void {
      if (inputType === "insertParagraph") {
        editor.model.deleteContent(event.getTargetRanges()[0]);
        editor.model.insertText('\n');
      }
    }
  }
  