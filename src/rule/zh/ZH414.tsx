import rule from "../utils/zhrule";
import visit from "unist-util-visit";
import {Punctuation, SentenceNode} from "../../parser/type";
import {isPunctuation, isWhiteSpace} from "nlcst-types";
import {isComma, isSlash, PUNCTUATION} from "../../parser/parser_node";
import {isStartOrEndInArray} from "./BASE";

// 斜杠前后不准有空格
export const ZH414 = rule(":ZH414", (tree, file, options) => {
  visit(tree, "SentenceNode", (_sen: any) => {
    visit(_sen, Punctuation, (node, i, parent)=>{
      if(isSlash(node) && !isStartOrEndInArray(i, parent.children)){
        if (isWhiteSpace(parent.children[i-1])){
          file.message(
            `shouldn't have white space before slash`,
            node.position.start
          );
        }

        if (isWhiteSpace(parent.children[i+1])){
          file.message(
            `shouldn't have white space after slash`,
            node.position.end
          );
        }

      }
    })

  });
});
