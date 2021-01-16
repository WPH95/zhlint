import visit from "unist-util-visit";

import rule from "../utils/zhrule";
import { SentenceNode } from "../../parser/type";
import { isPunctuation } from "nlcst-types";
import { PUNCTUATION } from "../../parser/parser_node";

//。！？：
const ALLOW_END_PUNCTUATION = [
  PUNCTUATION.STOP,
  PUNCTUATION.QUESTION,
  PUNCTUATION.EXCLAMATION,
  PUNCTUATION.COLON
];

export const ZH418 = rule(":ZH418", (tree, file, options) => {
  visit(tree, "SentenceNode", (_sen: any) => {
    const sentence: SentenceNode = _sen
    if (!sentence.isFull) {
      return;
    }
    for (const node of sentence.children) {
      if (isPunctuation(node) && !node.isCN){
        if (node.ptype === PUNCTUATION.ELLIPSIS){
          file.message(`shouldn't use en ellipsis:'${node.value}' in cn sentence`, node.position.start, "ZH412");
        }else {
          file.message(`shouldn't use half-width char:'${node.value}' in cn sentence`, node.position.start);
        }
      }
    }

  });
});
