import React, {
  useLayoutEffect,
  useRef,
  Fragment,
  forwardRef,
  LegacyRef,
  KeyboardEvent,
} from "react";
import { editor } from "../editor";
import { path } from ".";
import { marked } from "marked";

const lex = new marked.Lexer

const textType = ['image', 'text']


const inline = {
    before: (before) => `<span class="inline-before">${before}</span>`,
    after: (after) => `<span class="inline-after">${after}</span>`,
    type: (type, content) => `<${type}>${content}</${type}>`,
    link:({text, href, raw }) => `${inline.before('[')}<a>${text}</a>${inline.after(']')}<span class="inline-meta">${raw.split(']')[1]}</span>`
}

function tokenToHtml(token){
    if(textType.includes(token.type)){
        return token.raw
    }
    if(token.type==='link'){
        return `<span class='inline'>${inline.link(token)}</span>` 
    }
    const [before, after] = token.raw.split(token.text)
    const content = inline.type(token.type, token.tokens.map(tokenToHtml).join(''))

    return `<span class='inline'>${inline.before(before)}${content}${inline.after(after)}</span>` 
}

function genHtml(text){
  // @ts-ignore
  const tokens = lex.inlineTokens(text)
  return tokens.map(tokenToHtml).join('')
}
// lex.inlineTokens()

export const InlineText = ({ text, id }) => {

  path.push(id);
  if(!text) return <br/>
  return <span dangerouslySetInnerHTML={{__html:genHtml(text)}}></span>;
};
