import {marked} from "marked";

let defaultTxt = `
# dsffs
---

| sd | sd |
|---|---| 
|ds|sdd|

> 334
> - 3434dd
 - *Fudge**77*

- dsds
- sddfs


87878

dsfdd

4r45

fgdfg

`;

defaultTxt = defaultTxt 
+ '```js'
+ "\nvar a = 1"
+ "\nconsole.log(a)"
+ "\n```"
+ "\n"
+ "\n"

+ 'sfsdf'
// + '```js'
// + "\n//dsdsd"
// + "\n//sddsd"
// + "\n```"
// + "\n1"

function formatBlock(token) {
  if (
    ["blockquote", "heading", "list", "list_item", "paragraph", "hr", "code", "table"].includes(
      token.type
    )
  ) {
    const block = { blocks:[], ...token, isBlock: true };
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
    if(block.type === 'table'){
      block.header.forEach(b => {
        b.type = "paragraph"
      });
      block.rows.flat(99).forEach(b => {
        b.type = "paragraph"
      });
    }

    return block;
  }
}

export function parseMD(md = defaultTxt) {
  const tokens = marked.lexer(md) // new marked.Lexer({ breaks: true }).lex(md);
  console.log(tokens)
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
