import visit from "unist-util-visit";
import * as NODE_TYPE from "../../parser/type";
import { PUNCTUATION } from "../../parser/parser_node";
var toString = require("nlcst-to-string");

const IGNORE_FULL_CHECK_PUNCTUATION = [PUNCTUATION.SLASH];

export const punctuationRule = options => {
  return transformer;

  function transformer(tree, file) {
    // eng use half, chinese use full
    visit(tree, "SentenceNode", function(sentence: any) {
      let err = false;

      // 英文句子检测
      if (!sentence.isFull) {
        visitChildren(sentence, NODE_TYPE.Punctuation, (text, i, parent) => {
          if (text.isFull) {
            file.message(
              `shouldn't use full-width char:'${text.value}' in eng sentence`,
              text,
              "ZH417"
            );
            file.messages[file.messages.length - 1].fatal = true;
          }
        });
      } else {
        visitChildren(sentence, NODE_TYPE.Punctuation, (text, i, parent) => {
          if (text.isFull !== sentence.isFull) {
            if (text.ptype === "SLASH") {
              return;
            }
          }
        });
      }
    });
  }
};

export class PunctuationRule {
  visit = tree => {
    const createError = (node, msg) => {
      console.log(node, msg);
    };

    // eng use half, chinese use full
    visit(tree, "SentenceNode", function(sentence: any) {
      let err = false;

      // 英文句子检测
      if (!sentence.isFull) {
        visitChildren(sentence, NODE_TYPE.Punctuation, (text, i, parent) => {
          if (text.isFull) {
            createError(text, "英文句子中出现全角符号");
          }
        });
      } else {
        visitChildren(sentence, NODE_TYPE.Punctuation, (text, i, parent) => {
          if (text.isFull !== sentence.isFull) {
            if (text.ptype === "SLASH") {
              return;
            }
          }
        });
      }
    });
  };
}

const visitChildren = (tree, match, fn) => {
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type === match) {
      fn(node, i, tree);
    }
  }
};

export const isStartOrEndInArray = (i, children) => {
  return i === 0 || children.length - 1 === i;
};


export const getNear = (i, children)=>{
  let last = i!==0?children[i-1]:undefined
  let next = (i+1)!==children.length?children[i+1]:undefined

  return {
    last,
    next
  }

}