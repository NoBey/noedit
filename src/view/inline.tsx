import React, { useLayoutEffect } from "react";
import { editor } from "../editor";
import { path } from ".";
import { marked } from "marked";
import katex from 'katex'
import 'katex/dist/katex.css';
const lex = new marked.Lexer();

const textType = [ "text"];

const inline = {
  before: (before) => `<span class="inline-before">${before}</span>`,
  after: (after) => `<span class="inline-after">${after}</span>`,
  type: (type, content) => `<${type}>${content}</${type}>`,
  link: ({ text, href, raw }) => {
    if(text === raw) return `<a  herf='${href}'>${text}</a>`
    return  `${inline.before("[")}<a>${text}</a>${inline.after(
      "]"
    )}<span class="inline-meta">${raw.split("]")[1]}</span>`
  },
  image:({raw, href, text}) => `<span class="inline-meta">${raw}</span><img alt="${text}" src="${href}" />`
};

function tokenToHtml(token) {
  if (textType.includes(token.type)) {
    return token.raw;
  }
  if (token.type === "link") {
    return `<span class='inline'>${inline.link(token)}</span>`;
  }
  if (token.type === "image") {
    return `<span class='inline'>${inline.image(token)}</span>`;
  }


  // katex.renderToString('sdds')
  

  const [before, after] = token.raw.split(token.text);
  // if(token.type === 'codespan'){
  //   return  `<span class='inline'>${inline.before(before)}${token.text}${inline.after(after)}</span>`
  // }
  if (token.type === "inline-math") {
    return `<span class='inline inline-math'>${inline.before(before)}<span class="inline-meta">${token.text}</span>${katex.renderToString(token.text, { throwOnError: false})}${inline.after(before)}</span>`
    // return `<span class='inline'>${}</span>`;
  }
  const content = inline.type(
    token.type,
    token?.tokens?.map(tokenToHtml)?.join("") || token.text
  );

  return `<span class='inline'>${inline.before(before)}${content}${inline.after(
    after
  )}</span>`;
}

function genHtml(text) {
  // @ts-ignore
  const tokens = lex.inlineTokens(text);
  return tokens.map(tokenToHtml).join("");
}
// lex.inlineTokens()

export const InlineText = ({ text, id }) => {
  path.push(id);
  return <span dangerouslySetInnerHTML={{ __html: text ? genHtml(text) : "<br />" }}></span>;
};
