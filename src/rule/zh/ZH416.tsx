import visit from "unist-util-visit";

import rule from "unified-lint-rule";
import { SentenceNode } from "../../parser/type";
import { isPunctuation } from "nlcst-types";
import {isComma, PUNCTUATION} from "../../parser/parser_node";
import * as NODE_TYPE from "../../parser/type";
import { visitChildren } from "../base";

//。！？：
const ALLOW_END_PUNCTUATION = [
  PUNCTUATION.STOP,
  PUNCTUATION.QUESTION,
  PUNCTUATION.EXCLAMATION,
  PUNCTUATION.COLON
];

export const ZH416 = rule(":ZH416", (tree, file, options) => {
  visit(tree, "SentenceNode", (sentence: any) => {
    if (!sentence.index.punctuation) {
      return;
    }

    const hasComma = sentence.children.filter(s=>isPunctuation(s) && isComma(s)).length>0

    if (!hasComma){
      return;
    }

    const lastNode = sentence.children[sentence.children.length - 1];
    if (!isPunctuation(lastNode)) {
      file.message(
        `sentence end need an ending punctuation`,
        sentence.position.end
      );
      return;
    }
    if (ALLOW_END_PUNCTUATION.indexOf(lastNode.ptype) === -1) {
      file.message(
        `sentence ending punctuation '${lastNode.value}' is illegal`,
        sentence.position.end
      );
      return;
    }
  });
});
