import { marked } from "marked";
import TurndownService from "turndown";
import test from "./test1.md";
import katex from "katex";

const blockMath = {
  name: "block-math",
  level: "block",
  tokenizer(src, tokens) {
    const rule = /^(\${2})\s*([\s\S]*?[^\$])\s*\1(?!\$)/; //
    const match = rule.exec(src);
    if (match) {
      return {
        type: "code",
        // type: 'inline-math',
        lang: "math",
        raw: match[0],
        text: match[2],
      };
      //    if(match.index === 0){
      //     return {
      //       type: 'inline-math',
      //       raw: match[0],
      //       text: match[0].substr(1, match[0].length - 2),
      //     };
      //    }
      //  const list = (this.lexer.inlineTokens(src.slice(0, match.index)))
      //  const pre = list[0]
      //  return pre
    }
  },
  renderer(token) {
    return `\n<inline-math></inline-math>`;
  },
};

const inlineMath = {
  name: "inline-math",
  level: "inline",
  tokenizer(src, tokens) {
    const rule = /\$(.*?)\$/; //
    const match = rule.exec(src);
    if (match) {
      if (match.index === 0) {
        if (!match[1].trim()) {
          return {
            type: "text",
            raw: match[0],
            text: match[0],
          };
        }
        return {
          type: "inline-math",
          raw: match[0],
          text: match[1],
        };
      }
      const list = this.lexer.inlineTokens(src.slice(0, match.index));
      const pre = list[0];
      return pre;
    }
    return false;
  },
  renderer(token) {
    return `\n<inline-math></inline-math>`;
  },
};

marked.use({ extensions: [inlineMath, blockMath] });
// @ts-ignore
window.katex = katex;
const turndownService = new TurndownService();
// @ts-ignore
window.marked = marked;
// @ts-ignore
window.turndownService = new TurndownService();

export function parseHtml(html: string): string {
  return turndownService.turndown(html);
}

export function HtmlToModel(html) {
  return parseMD(parseHtml(html)).blocks;
}

let defaultTxt = `
${test}
`;

function formatBlock(token) {
  if (
    [
      "blockquote",
      "heading",
      "list",
      "list_item",
      "paragraph",
      "hr",
      "code",
      "table",
    ].includes(token.type)
  ) {
    const block = { blocks: [], ...token, isBlock: true };
    if (block.type === "list_item") {
      if (block?.tokens[0] && block?.tokens[0].type === "text") {
        block.tokens[0].type = "paragraph";
      }
    }

    if (block?.tokens?.length) {
      block.blocks = block?.tokens.map(formatBlock).filter((n) => n);
    }
    if (block.type === "list") {
      if (block?.items?.length === 0) return;
      block.blocks = block?.items.map(formatBlock).filter((n) => n);
    }
    if (block.type === "table") {
      block.header.forEach((b) => {
        b.type = "paragraph";
      });
      block.rows.flat(99).forEach((b) => {
        b.type = "paragraph";
      });
    }

    return block;
  }
}

export function parseMD(md = defaultTxt) {
  const tokens = marked.lexer(md); // new marked.Lexer({ breaks: true }).lex(md);
  console.log(tokens);
  return {
    type: "root",
    blocks: tokens.map(formatBlock).filter((n) => n),
  };
}

// function normalize(block, parent) {
//     block.parent = parent;
//     if (!block.id) block.id = ++index;
//     idToBlock[block.id] = block;
//     if (["list_item", "blockquote", "list"].includes(block.type)) {
//       if (block.blocks.length === 0) {
//         editor.deleteBlock(block.id);
//       }
//     }
//     block.blocks.forEach((b) => normalize(b, block));
//     return block;
//   }

//   function formatRoot(tokens) {
//     return ;
//   }
