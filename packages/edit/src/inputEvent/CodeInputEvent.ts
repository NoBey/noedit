import { editor } from "src/editor";
import { InputEventStrategy } from ".";

export class CodeInputEvent implements InputEventStrategy {
    accept(inputType: string, event?: InputEvent) {
      if(inputType==="insertParagraph" && editor.selection.focusBlock.type === "code"){
        return true
      }
      if(inputType.startsWith("delete") && editor.selection.type==="Caret" && editor.selection.focusBlock.type === "code" && editor.selection.focusOffset === 0){
        return true
      }
      return false;
    }
    execute(inputType: string, event?: InputEvent): void {
      if (inputType === "insertParagraph") {
        editor.model.deleteContent(event.getTargetRanges()[0]);
        editor.model.insertText('\n');
      }
      if(inputType.startsWith("delete")){
        if(!editor.selection.focusBlock.text || editor.selection.focusBlock.text === '\n'){
          editor.model.deleteContent(event.getTargetRanges()[0]);
        }
      }
    }
  }
  