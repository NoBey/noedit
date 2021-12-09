// @ts-nocheck
import * as marked from "marked";
import { selection } from "./selection";
import { createUpdateOperation, createDelOperation } from "./operation";
import { Block } from "./block";

export function createEditor({ model }) {
  const editor = {
    model,
    selection,
    modelChangeCB: [],
    onModelChange(cb) {
      editor.modelChangeCB.push(cb);
    },
    applyModelChange() {
      if (this.changTime) clearTimeout(this.changTime);
      this.changTime = setTimeout(() => {
        normalize(editor.model);
        editor.modelChangeCB.forEach((cb) => cb.call(editor));
        selection.reset();
      }, 0);
    },
    deleteBlock(id) {
      editor.applyOperation(createDelOperation(id));
    },
    applyOperation(operation) {
      const { type, arg } = operation;
      if (type === "update") {
        const block = Block.getBlockByid(arg.id);
        const keys = Object.keys(arg);
        keys.forEach((k) => {
          block[k] = arg[k];
        });
      }
      if (type === "delete") {
        const block = Block.getBlockByid(arg.id);
        block.parent.blocks = block.parent.blocks.filter(
          ({ id }) => id !== arg.id
        );
      }

      editor.applyModelChange();
    },
    deleteContentBackward() {
      const { selection } = editor;
      if (selection.type === "Range") {
        const {
          startOffset,
          endOffset,
          startContainer,
          endContainer,
          commonAncestor
        } = selection;
        if (startContainer === endContainer) {
          let text = selection.focusBlock.text;
          text = text.slice(0, startOffset) + text.slice(endOffset);
          editor.applyOperation(
            createUpdateOperation(startContainer.id, { text })
          );
          selection.collapse(startContainer, startOffset);
          return;
        }
        // TODO:
        startContainer.text = startContainer.text.slice(0, startOffset);
        startContainer.text += endContainer.text.slice(endOffset);
        const stack = [commonAncestor];
        let flag = false;
        while (stack.length) {
          const block = stack.pop();
          [...block.blocks].reverse().forEach((b) => {
            stack.push(b);
          });
          if (flag && Block.isTextBlock(block.id)) {
            editor.applyOperation(createDelOperation(block.id));
          }
          if (block === startContainer) flag = true;
          if (block === endContainer) break;
        }
        selection.collapse(startContainer, startOffset);
      } else {
        const { focusOffset, focusBlock } = selection;

        if (focusBlock.parent.type === "list_item" && focusOffset === 0) {
          const parent = focusBlock.parent;
          const parentBlocks = [...focusBlock.parent.blocks];
          const parentBlocksIndex = parentBlocks.indexOf(focusBlock);
          if (parentBlocksIndex === 0) {
            const parentBlocks = [...parent.parent.blocks];
            const parentBlocksIndex = parentBlocks.indexOf(parent);
            if (parentBlocksIndex > 0) {
              const preBlock = parentBlocks[parentBlocksIndex - 1];
              const blocks = [...preBlock.blocks, ...parent.blocks];

              editor.applyOperation(
                createUpdateOperation(preBlock.id, { blocks })
              );
              editor.applyOperation(createDelOperation(parent.id));
              selection.collapse(focusBlock);
              return;
            }
          }
        }

        if (focusOffset === 0) {
          let text = focusBlock.text;
          const preBlock = Block.getPreviousTextBlock(focusBlock.id);
          if (preBlock === focusBlock) return;
          text = preBlock.text + text;
          const offset = preBlock.text.length;
          editor.applyOperation(createUpdateOperation(preBlock.id, { text }));
          editor.applyOperation(createDelOperation(focusBlock.id));
          selection.collapse(preBlock, offset);
          return;
        }
        let text = focusBlock.text;
        text = text.slice(0, focusOffset - 1) + text.slice(focusOffset);
        editor.applyOperation(createUpdateOperation(focusBlock.id, { text }));
        selection.collapse(focusBlock, focusOffset - 1);
        return;
      }
    },
    insertText(event) {
      const { selection } = editor;
      const { focusOffset, focusBlock } = selection;
      let text = selection.focusBlock.text;
      text = text.slice(0, focusOffset) + event.data + text.slice(focusOffset);
      editor.applyOperation(
        createUpdateOperation(selection.focusBlock.id, { text })
      );

      // TODO:
      if (text.startsWith("> ")) {
        const newBlock = Block.createBlockquoteBlock(focusBlock);
        focusBlock.text = focusBlock.text.replace("> ", "");
        // editor.applyOperation(createDelOperation(focusBlock.id));
        const parentBlocks = [...focusBlock.parent.blocks];
        const parentBlocksIndex = parentBlocks.indexOf(focusBlock);
        parentBlocks.splice(parentBlocksIndex, 1, newBlock);
        editor.applyOperation(
          createUpdateOperation(focusBlock.parent.id, {
            blocks: parentBlocks
          })
        );
        selection.collapse(newBlock);
        return;
      }

      if (text.startsWith("- ")) {
        const newBlock = Block.createListBlock(focusBlock);
        focusBlock.text = focusBlock.text.replace("- ", "");
        // editor.applyOperation(createDelOperation(focusBlock.id));
        const parentBlocks = [...focusBlock.parent.blocks];
        const parentBlocksIndex = parentBlocks.indexOf(focusBlock);
        parentBlocks.splice(parentBlocksIndex, 1, newBlock);
        editor.applyOperation(
          createUpdateOperation(focusBlock.parent.id, {
            blocks: parentBlocks
          })
        );
        selection.collapse(newBlock);
        return;
      }

      selection.collapse(focusBlock, focusOffset + 1);
    },
    insertParagraph(event) {
      const { selection } = editor;
      const {
        startOffset,
        endOffset,
        startContainer,
        endContainer,
        commonAncestor
      } = selection;
      if (selection.type === "Range") {
        if (startContainer === endContainer) {
          let text = selection.focusBlock.text;

          const newBlock = Block.createParagraphBlock(text.slice(endOffset));
          text = text.slice(0, startOffset);
          const parentBlocks = [...startContainer.parent.blocks];
          const parentBlocksIndex = parentBlocks.indexOf(startContainer);
          parentBlocks.splice(parentBlocksIndex + 1, 0, newBlock);

          editor.applyOperation(
            createUpdateOperation(startContainer.id, { text })
          );
          editor.applyOperation(
            createUpdateOperation(startContainer.parent.id, {
              blocks: parentBlocks
            })
          );
          selection.collapse(newBlock);
          return;
        }

        // TODO:
        startContainer.text = startContainer.text.slice(0, startOffset);
        const newBlock = Block.createParagraphBlock(
          endContainer.text.slice(endOffset)
        );

        const stack = [commonAncestor];
        let flag = false;
        while (stack.length) {
          const block = stack.pop();
          [...block.blocks].reverse().forEach((b) => {
            stack.push(b);
          });
          if (flag && Block.isTextBlock(block.id)) {
            editor.applyOperation(createDelOperation(block.id));
          }
          if (block === startContainer) flag = true;
          if (block === endContainer) break;
        }
        const parentBlocks = [...startContainer.parent.blocks];
        const parentBlocksIndex = parentBlocks.indexOf(startContainer);
        parentBlocks.splice(parentBlocksIndex + 1, 0, newBlock);
        editor.applyOperation(
          createUpdateOperation(startContainer.parent.id, {
            blocks: parentBlocks
          })
        );

        selection.collapse(newBlock);
      } else {
        const { focusBlock, focusOffset } = selection;
        let text = focusBlock.text;

        if (focusBlock.parent.type === "blockquote") {
          const blockquote = focusBlock.parent;
          const blockquoteBlocks = [...focusBlock.parent.blocks];
          const parentIndex = blockquoteBlocks.indexOf(focusBlock);

          if (parentIndex + 1 === blockquoteBlocks.length && !focusBlock.text) {
            const blockquoteParentBlocks = [...blockquote.parent.blocks];
            const blockquoteIndex = blockquoteParentBlocks.indexOf(blockquote);
            blockquoteParentBlocks.splice(blockquoteIndex + 1, 0, focusBlock);
            editor.applyOperation(createDelOperation(focusBlock.id));
            editor.applyOperation(
              createUpdateOperation(blockquote.parent.id, {
                blocks: blockquoteParentBlocks
              })
            );
            return;
          }
        }

        if (focusBlock.parent.type === "list_item") {
          const parent = focusBlock.parent;
          const parentBlocks = [...focusBlock.parent.blocks];
          const parentBlocksIndex = parentBlocks.indexOf(focusBlock);

          // list 尾部退出
          if (focusBlock.text === "" && parentBlocks.length === 1) {
            const listBlocks = [...parent.parent.blocks];
            const liIndex = listBlocks.indexOf(parent);
            if (liIndex + 1 === listBlocks.length) {
              const listParentBlocks = [...parent.parent.parent.blocks];
              const listIndex = listParentBlocks.indexOf(parent.parent);
              listParentBlocks.splice(listIndex + 1, 0, focusBlock);

              editor.applyOperation(createDelOperation(focusBlock.id));
              editor.applyOperation(
                createUpdateOperation(parent.parent.parent.id, {
                  blocks: listParentBlocks
                })
              );

              return;
            }
          }

          // 第一个
          if (parentBlocksIndex === 0) {
            const newBlock = Block.createListItemBlock(
              Block.createParagraphBlock(text.slice(focusOffset))
            );
            text = text.slice(0, focusOffset);
            const parentBlocks = [...parent.parent.blocks];
            const parentBlocksIndex = parentBlocks.indexOf(parent);
            parentBlocks.splice(parentBlocksIndex + 1, 0, newBlock);
            editor.applyOperation(
              createUpdateOperation(focusBlock.id, { text })
            );
            editor.applyOperation(
              createUpdateOperation(parent.parent.id, { blocks: parentBlocks })
            );
            selection.collapse(newBlock, 0);

            return;
          }

          // 最后一个
          if (!text.length && parentBlocksIndex + 1 === parentBlocks.length) {
            editor.applyOperation(createDelOperation(focusBlock.id));
            const newBlock = Block.createListItemBlock(focusBlock);
            const parentBlocks = [...parent.parent.blocks];
            const parentBlocksIndex = parentBlocks.indexOf(parent);
            parentBlocks.splice(parentBlocksIndex + 1, 0, newBlock);
            editor.applyOperation(
              createUpdateOperation(parent.parent.id, { blocks: parentBlocks })
            );
            selection.collapse(focusBlock);
            return;
            // createListItemBlock
          }
        }

        const newBlock = Block.createParagraphBlock(text.slice(focusOffset));
        text = text.slice(0, focusOffset);
        const parentBlocks = [...focusBlock.parent.blocks];
        const parentBlocksIndex = parentBlocks.indexOf(focusBlock);
        parentBlocks.splice(parentBlocksIndex + 1, 0, newBlock);
        editor.applyOperation(
          createUpdateOperation(selection.focusBlock.id, { text })
        );
        editor.applyOperation(
          createUpdateOperation(focusBlock.parent.id, { blocks: parentBlocks })
        );
        selection.collapse(newBlock, 0);
        console.log(event);
        // console.log(event.getTargetRanges());
      }
    }
  };

  return editor;
}

const tokens = new marked.Lexer({ breaks: true }).lex(`
# dsffs

> 334
> - 3434dd
 - *Fudge**77*

- dsds
- sddfs

87878

`);
export let index = 0;
export const idToBlock = {};

export const editor = createEditor({ model: formatRoot(tokens) });
window.editor = editor;

function normalize(block, parent) {
  block.parent = parent;
  if (!block.id) block.id = ++index;
  idToBlock[block.id] = block;
  if (["list_item", "blockquote", "list"].includes(block.type)) {
    if (block.blocks.length === 0) {
      editor.deleteBlock(block.id);
    }
  }
  block.blocks.forEach((b) => normalize(b, block));
  return block;
}

function formatBlock(token) {
  if (
    ["blockquote", "heading", "list", "list_item", "paragraph", "hr"].includes(
      token.type
    )
  ) {
    const block = { ...token, isBlock: true };
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

    return block;
  }
}
function formatRoot(tokens) {
  return normalize({
    type: "root",
    blocks: tokens.map(formatBlock).filter((n) => n)
  });
}
