import { editor } from "src/editor";
import { InputEventStrategy } from ".";

export class BaseInputEvent implements InputEventStrategy {
    accept(inputType: string, event?: InputEvent) {
      return true;
    }
    execute(inputType: string, event?: InputEvent): void {
      if (inputType.startsWith("delete")) {
        editor.model.deleteContent(event.getTargetRanges()[0]);
      }
      if (inputType === "insertText") {
        editor.model.deleteContent(event.getTargetRanges()[0]);
        console.log(event.data);
        editor.model.insertText(event.data);
      }
      if (inputType === "insertParagraph") {
        editor.model.deleteContent(event.getTargetRanges()[0]);
        editor.model.insertParagraph();
      }
    }
  }
  