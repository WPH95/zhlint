import rule from "../utils/zhrule";
import visit from "unist-util-visit";
import {Punctuation, SentenceNode} from "../../parser/type";
import {isLeftParenthesis, isRightParenthesis, isSlash} from "../../parser/parser_node";
import {isStartOrEndInArray} from "./BASE";
import {isPunctuation, isWhiteSpace} from "nlcst-types";


//括号里全为英文时建议使用半角括号，并在括号前后各空一个半角空格，括号和括号内的英文之间不需要空格。
// 【错误420】数据定义语言（DDL）是一种……（使用了全角括号）
// 【错误421】数据定义语言(DDL)是一种……（半角括号前后未空格）
// 【错误422】数据定义语言 ( DDL ) 是一种……（半角括号和半角括号内的英文之间空了一格）
// 【正确示例】数据定义语言 (DDL) 是一种……
// 括号里既有中文又有英文（即只要括号内包含任何中文）时建议使用全角括号，括号前后不空格。
// 【错误423】斜杠 (slash 或 forward slash) 和反斜杠 (backslash) 是两种符号。
// 【正确示例】斜杠（slash 或 forward slash）和反斜杠 (backslash) 是两种符号。
export const ZH420_423 = rule(":ZH420", (tree, file, options) => {
  visit(tree, "SentenceNode", (_sen: any) => {
    const sen:SentenceNode = _sen;
    let left;
    let cache = []
    for (let child of sen.children) {
      if (isPunctuation(child)){
        if (isLeftParenthesis(child)){
          if (left){
            file.message("miss right parenthesis", child.position.start, "ZH403")
            continue
          }
          left = child
        }

        if (isRightParenthesis(child)){
          if (!left){
            file.message("miss left parenthesis", child.position.start, "ZH403")
            continue
          }
          parenthesisCheck(left, child, cache, file)

          // clear
          cache = []
          left = undefined
        }
      }
      if (left){
        cache.push(child)
      }

    }

    if (left){
      file.message("miss right parenthesis", sen.position.end, "ZH403")
    }

  });
});


const  parenthesisCheck = (left, right, children, file)=>{

}