const _inspect = require("unist-util-inspect");
import rule from "unified-lint-rule";

export const Inspect = rule(":Inspect", (tree, file, options) => {
  console.log(_inspect(tree))
});
