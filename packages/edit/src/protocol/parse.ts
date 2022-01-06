import { marked } from 'marked';
import TurndownService from 'turndown';
import test from '../test1.md';
import katex from 'katex';

const blockMath = {
  name: 'block-math',
  level: 'block',
  tokenizer(src, tokens) {
    const rule = /^(\${2})\s*([\s\S]*?[^\$])\s*\1(?!\$)/; //
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'code',
        // type: 'inline-math',
        lang: 'math',
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
  name: 'inline-math',
  level: 'inline',
  tokenizer(src, tokens) {
    const rule = /\$(.*?)\$/; //
    const match = rule.exec(src);
    if (match) {
      if (match.index === 0) {
        if (!match[1].trim()) {
          return {
            type: 'text',
            raw: match[0],
            text: match[0],
          };
        }
        return {
          type: 'inline-math',
          raw: match[0],
          text: match[1],
        };
      }
      // @ts-ignore
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
    ['blockquote', 'heading', 'list', 'list_item', 'paragraph', 'hr', 'code', 'table', 'space'].includes(token.type)
  ) {
    if ('space' === token.type) {
      return { type: 'paragraph', blocks: [], text: '', isBlock: true };
    }
    const block = { blocks: [], ...token, isBlock: true };
    if (block.type === 'list_item') {
      if (block?.tokens[0] && block?.tokens[0].type === 'text') {
        block.tokens[0].type = 'paragraph';
      }
    }

    if (block?.tokens?.length) {
      block.blocks = block?.tokens.map(formatBlock).filter((n) => n);
    }
    if (block.type === 'list') {
      if (block?.items?.length === 0) return;
      block.blocks = block?.items.map(formatBlock).filter((n) => n);
    }
    if (block.type === 'table') {
      block.header.forEach((b) => {
        b.type = 'paragraph';
      });
      block.rows.flat(99).forEach((b) => {
        b.type = 'paragraph';
      });
    }

    return block;
  }
}
// @ts-ignore
window.parseMD = parseMD;
export function parseMD(md = defaultTxt) {
  const tokens = marked.lexer(md); // new marked.Lexer({ breaks: true }).lex(md);
  console.log(tokens);
  return {
    type: 'root',
    blocks: tokens.map(formatBlock).filter((n) => n),
  };
}

// @ts-ignore
window.modelToMD = modelToMD;
export function modelToMD(model) {
  // if(model.type === 'root')
  return model.blocks.map((block) => blockToMD(block)).join('\n');
}

function headDepth(depth) {
  return new Array(depth).fill('#').join('');
}

function listDepth(depth) {
  console.log({ depth });
  return new Array(depth * 2).fill(' ').join('');
}

function tableAlign(align) {
  if (align === 'center') return ':--:';
  if (align === 'right') return '---:';
  if (align === 'left') return ':---';
  return '----';
}

export function blockToMD(block, listIndex = 0) {
  const { type, text, blocks = [] } = block;
  const childMD = blocks.map((block) => blockToMD(block));
  if (type === 'paragraph') return text;
  if (type === 'heading') return `${headDepth(block.depth)} ${text}`;
  if (type === 'blockquote') return childMD.map((md) => `> ${md}`).join('\n');
  if (type === 'hr') return '---\n';
  if (type === 'list_item') {
    const { task, checked } = block;
    return (
      '- ' +
      (task ? `[${checked ? 'x' : ' '}] ` : '') +
      childMD
        .join('\n')
        .split('\n')
        .join('\n' + '  ')
    );
  }

  if (type === 'list') {
    const { ordered, start = 1 } = block;
    if (ordered) {
      return childMD.map((md, i) => `${start + i}. ${md.slice(2)}`).join('\n');
    }
    return childMD.map((md) => `${md}`).join('\n');
  }
  if (type === 'code') {
    return '```' + block.lang + '\n' + text + '\n```';
  }
  if (type === 'table') {
    const { header = [], rows, align } = block;
    let html = `| ${header.map(blockToMD).join(' | ')} |\n`;
    html += `| ${align.map(tableAlign).join(' | ')} |\n`;
    rows.forEach((row) => {
      html += `| ${row.map(blockToMD).join(' | ')} |\n`;
    });
    return html;
  }
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
