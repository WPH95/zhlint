import rule from "../utils/zhrule";
import visit from "unist-util-visit";
import {Punctuation, SentenceNode} from "../../parser/type";
import {isPunctuation, isWhiteSpace} from "nlcst-types";
import {isComma, isHyphen, isSlash, PUNCTUATION} from "../../parser/parser_node";
import {isStartOrEndInArray} from "./BASE";

// 连接与破折号前后不准有空格
export const ZH410= rule(":ZH410", (tree, file, options) => {
  visit(tree, "SentenceNode", (_sen: any) => {
    visit(_sen, Punctuation, (node, i, parent)=>{
      if(isHyphen(node) && !isStartOrEndInArray(i, parent.children)){
        if (isWhiteSpace(parent.children[i-1])){
          file.message(
            `shouldn't have white space before hyphen`,
            node.position.start
          );
        }

        if (isWhiteSpace(parent.children[i+1])){
          file.message(
            `shouldn't have white space after hyphen`,
            node.position.end
          );
        }

      }
    })

  });
});
