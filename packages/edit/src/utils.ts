import katex from 'katex'
import "katex/dist/katex.css";

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