import visit from "unist-util-visit";
import * as NODE_TYPE from "../parser/type";
import rule from "unified-lint-rule";

export const visitChildren = (tree, match, fn) => {
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type === match) {
      fn(node, i, tree);
    }
  }
};

export const baseCountRule = (name,punctuationName, matchFunc, eq, default_limit)=>{
  return rule(name, (tree, file, options={limit: default_limit})=>{
    const limit = options.limit;
    visit(tree, "SentenceNode", (sentence: any) => {
      let count = 0;
      visitChildren(sentence, NODE_TYPE.Punctuation, (pnode, i, parent) => {
        if (matchFunc(pnode)) {
          count += 1;
        }
      });
      if (eq==="lt" && count>limit){
        file.message(`sentence ${punctuationName} count:${count}, bigger than limit:${limit}`, sentence)
      }
      if (eq ==="gt" && count!==0 && count < limit ){
        file.message(`sentence ${punctuationName} count:${count}, smaller than limit:${limit}`, sentence)
      }
    });
  })
}