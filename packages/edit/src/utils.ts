import katex from 'katex'
import "katex/dist/katex.css";
import { BlockInterface } from './model';

export function *iterationTextNode(dom: Node): Iterable<Text> {
    if(!dom) return dom
    const stack = [dom]
    while (stack.length) {
      let node = stack.pop()
      if((node as HTMLBaseElement)?.classList?.contains?.('katex')) continue
      if(node.nodeName === '#text'){
          yield node as Text
      }
      stack.push(...Array.from(node?.childNodes || []).reverse())
    }
}

export function *iterationTextBlock(block: BlockInterface): Iterable<BlockInterface> {
  if(!block) return 
  const stack = [block]
  while (stack.length) {
    let block = stack.pop()
    if(['paragraph','heading', 'code'].includes(block.type)){
        yield block 
    }
    stack.push(...Array.from(block?.blocks || []).reverse())
  }
}
export function getKatexHtml(text){
  return katex.renderToString(
    text,
    { throwOnError: false }
  )
}

export function getKatexElm(elm, text){
  return katex.render(
    text, elm, 
    { throwOnError: false }
  )
}

export async function fileToBlob(file){
  return new Blob([new Uint8Array(await file.arrayBuffer())], {type: file.type });
}
