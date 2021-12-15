

export function *iterationTextNode(dom: Node): Iterable<Text> {
    if(!dom) return dom
    const stack = [dom]
    while (stack.length) {
      let node = stack.pop()
      if(node.nodeName === '#text'){
          yield node as Text
      }
      stack.push(...Array.from(node?.childNodes || []).reverse())
    }
}