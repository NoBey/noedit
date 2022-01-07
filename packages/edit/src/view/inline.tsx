import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
// import { editor } from "../editor";
// import { path } from ".";
import { marked } from "marked";

import { getKatexHtml } from "../utils";
import { useEditor } from "../hooks/useEditor";
const lex = new marked.Lexer();


function htmlUnEscape(str) {
  return str.replace(/&lt;|&gt;|&quot;|&amp;/g, (match) => {
    switch (match) {
      case '&lt;':
        return '<';
      case '&gt;':
        return '>';
      case '&quot;':
        return '"';
      case '&amp;':
        return '&';
    }
  });
}

const Text = React.memo(({ text }: InlineToken) => htmlUnEscape(text)) 

const Em = React.memo( ({ text, raw, tokens = [] }: InlineToken) => {
  const [before, after] = raw.split(text);
  return <span className='inline'>
    <span className="inline-before">{(before)}</span>
    <em>{ tokens.length ? <InlineBlocks tokens={tokens} /> : text}</em>
    <span className="inline-after">{(after)}</span>
  </span>
})

const Del = React.memo( ({ text, raw, tokens = [] }: InlineToken) => {
  const [before, after] = raw.split(text);
  return <span className='inline'>
    <span className="inline-before">{(before)}</span>
    <del>{ tokens.length ? <InlineBlocks tokens={tokens} /> : text}</del>
    <span className="inline-after">{(after)}</span>
  </span>
})

const Codespan =  React.memo(({ text, raw, tokens = [] }: InlineToken) => {
  const [before, after] = raw.split(text);
  return <span className='inline'>
    <span className="inline-before">{(before)}</span>
    <code>{ tokens.length ? <InlineBlocks tokens={tokens} /> : text}</code>
    <span className="inline-after">{(after)}</span>
  </span>
})


const Strong =  React.memo(({ text, raw, tokens = [] }: InlineToken) => {
  const [before, after] = raw.split(text);
  return <span className='inline'>
    <span className="inline-before">{(before)}</span>
    <strong>{ tokens.length ? <InlineBlocks tokens={tokens} /> : text}</strong>
    <span className="inline-after">{(after)}</span>
  </span>
})

const Link =  React.memo(({ text, raw, href }: InlineToken) => {
  if (text === raw) return <a href={href}>{text}</a>
  
  return <span className='inline'>
    <span className="inline-before">[</span>
    <a href={href}>{text}</a>
    <span className="inline-after">]</span>
    <span className="inline-meta">{raw.split("]")[1]}</span>
  </span>

})

const Escape =  React.memo(({ raw, text }: InlineToken) => {
  const [before, after] = raw.split(text);
  return <span className='inline'>
    <span className="inline-before">{(before)}</span>
    <span>{text}</span>
  </span>
})



const Image = React.memo(({ text, raw, href }: InlineToken) => {
  const click = (e) => window.getSelection().collapse(e.target.previousElementSibling)
  return <span className='inline'>
    <span className="inline-meta">{raw}</span><img onClick={click} alt={text} src={href} />
  </span>
})

const Html =  React.memo( ({ raw }: InlineToken) => {
  return <span className='inline'>
    {(raw)}
  </span>
})

const InlineMath =  React.memo(({ text, raw, href }: InlineToken) => {
  const ref = useRef<HTMLSpanElement>()
  // const katex = getKatexHtml(text)
  const [before, after] = raw.split(text);
  useEffect(() => {
    if (ref) {
      const div = document.createElement('div')
      div.innerHTML = getKatexHtml(text)
      ref.current.replaceWith(div.children[0])
    }
  })

  return <span className='inline inline-math'>
    <span className="inline-before">{before}</span>
    <span className="inline-meta">{text}</span>
    <span ref={ref}></span>
    <span className="inline-after">{after}</span>
  </span>

})

const InlineMap = {
  'del': Del,
  'em': Em,
  'codespan': Codespan,
  'strong': Strong,
  'html': Html,
  "image": Image,
  "link": Link,
  "text": Text,
  "escape": Escape,
  "inline-math": InlineMath
}

const InlineBlocks = ({ tokens = [] }) => {

  return <>
    {tokens.map((token, i) => {
      if (!InlineMap[token.type]) {
        console.error('未找到 token', token, token.type)
      }
      const Cmp = InlineMap[token.type]
      return <Cmp key={i} {...token} />
    })}
  </>

}

export interface InlineToken {
  text?: string
  raw: string
  href?: string
  tokens?: InlineToken[]
}

export const InlineText = React.memo( ({ text, id }: any) => {
  const tokens = lex.inlineTokens(text, [])
  if (!text || !tokens.length) return <span dangerouslySetInnerHTML={{__html:"<br />"}}></span>
  return (
    <span>
      <InlineBlocks tokens={tokens} />
    </span>
  );
});
