import visit from "unist-util-visit";
import rule from "unified-lint-rule"
import {visitChildren} from "../base";
import {Punctuation} from "../../parser/type";


export const hasFullwidthInEnFunc = (tree, file)=> {

    // eng use half, chinese use full
    visit(tree, "SentenceNode", (sentence: any)=> {
      // 英文句子检测
      if (!sentence.isFull) {
        visitChildren(sentence, Punctuation, (text, i, parent) => {
          if (text.isFull) {
            file.message(`shouldn't use full-width char:'${text.value}' in en sentence`, text.position.start);
          }
        });
      }
    })
}

export const ZH417 =  rule(':ZH417', hasFullwidthInEnFunc)
