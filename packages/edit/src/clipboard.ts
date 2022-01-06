import { EditorInterface } from "./editor";
import { BlockInterface } from "./model";
import { HtmlToModel, parseMD } from "./parse";
import { fileToBlob } from "./utils";


export interface ClipboardInterface extends clipboard {}

export class clipboard{
    editor: EditorInterface
    constructor(editor: EditorInterface){
      this.editor = editor
    }
    contnet: Promise<BlockInterface[]> 
    addData(dataTransfer: DataTransfer){
      const { editor } = this
        // console.log(dataTransfer.getData('Files'), dataTransfer.types)
       
        if(dataTransfer.types.includes("Files")){
          
          this.contnet = Promise.all(Array.from(dataTransfer.files).map(async (file) => {
            if(file.type.startsWith('image')){
             return editor.createParagraphBlock(`![${file.name}](${URL.createObjectURL(await fileToBlob(file)) })`)
            }
            return editor.createParagraphBlock(file.name)
          }));

        }

        if (dataTransfer.types.includes("text/html")) {
          this.contnet = Promise.resolve(HtmlToModel(dataTransfer.getData("text/html"))) ;
          return;
        } else if (dataTransfer.types.includes("text/plain")) {
          const text = dataTransfer.getData("text/plain")
          // console.log('onPaste', text)
          this.contnet = Promise.resolve(parseMD(text).blocks);
        }
    }
    async getData(){
        const {contnet} = this
        this.contnet = null
        return await contnet
    }
}