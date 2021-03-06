import { Root, Sentence } from "nlcst-types";
const vfile = require("to-vfile");
const toNlcst = require("mdast-util-to-nlcst");
const inspect = require("unist-util-inspect");
const Chinese = require("./parser/parser");
const remark = require("remark");
const gfm = require("remark-gfm");
const frontmatter = require("remark-frontmatter");
var remark2retext = require("remark-retext");
var unified = require('unified')
import {ZH417} from "./rule/zh/ZH417";
import {ZH400} from "./rule/zh/ZH400";
import {ZH403} from "./rule/zh/ZH403";
import {ZH416} from "./rule/zh/ZH416";
import {ZH418} from "./rule/zh/ZH418";
import {Inspect} from "./rule/zh/inspect";
import {ZH414} from "./rule/zh/ZH414";
import {ZH410} from "./rule/zh/ZH410";
import {ZH420_423} from "./rule/zh/ZH420_423";
import {ZH425} from "./rule/zh/ZH425";
import visit from "unist-util-visit";
import {node2String} from "./parser/parse-chinese";
var stringify = require('remark-stringify')
var report = require('vfile-reporter')
var english = require('retext-english')

const remark_zh =remark()
  .use(gfm)
  .use(frontmatter, ["yaml", "toml"])
  .use(
    remark2retext,
    unified()
      .use(Chinese)
      .use(ZH400)
      .use(ZH403)
      .use(ZH414)
      .use(ZH416, [2])
      .use(ZH417, [2])
      .use(ZH418, [2])
      .use(ZH410)
      .use(ZH420_423)
      .use(ZH425)
      .use(count)
  ).use(stringify)

const unicodeLength = require('unicode-length')
var toString = require("nlcst-to-string");



function count() {
  return counter;
  function counter(tree, file) {
    file.counts = {};
    file.counts.char = unicodeLength.get(toString(tree))
    visit(tree, "SentenceNode",(node)=>{
      file.counts.sen = (file.counts.sen || 0) + 1;
    });
  }
}



module.exports = remark_zh
// const file = vfile.readSync(
//   "/Users/wph95/hackathon/2021/remark-zh/cn.md",
//   "utf8"
// );
//
// remark_zh.process(vfile.readSync('/Users/wph95/hackathon/2021/remark-zh/cn.md'), function(err, file) {
//     console.error(report(err || file))
//   });
//

// const tree:Root = toNlcst(mdast, file, Chinese)

// const rule = new PunctuationRule();
// rule.visit(tree);

// const raw  = String(file)
// nlcst.children.map(n=>{
//   if (n.type === "ParagraphNode") {
//     n.children.map((sen: Sentence) => {
//       console.log(raw.substring(sen.position.start.offset, sen.position.end.offset))
//       console.log("---")
//     })
//
//   }}
// )

// console.log(inspect.noColor(tree))


const total = []
const files = {
  counts : []
}

function processFile(path){
   remark_zh.process(vfile.readSync(path), function(err, file) {
     total.push(...(file?.messages || []))
    console.error(report(err || file))
     files.counts.push(file.counts)
  });
}

var glob = require("glob")

// glob.sync("/Users/wph95/hackathon/2021/base_docs/k8s-website/content/zh/**/*.md", {}).map(file=>processFile(file))
// glob.sync("/Users/wph95/hackathon/2021/base_docs/docs-cn/**/*.md", {}).map(file=>processFile(file))
// glob.sync("/Users/wph95/hackathon/2021/base_docs/docs-cn/whats-new-in-tidb-4.0.md", {}).map(file=>processFile(file))
// glob.sync("/Users/wph95/hackathon/2021/base_docs/qingcloud-docs-master/content/**/*.md", {}).map(file=>processFile(file))
glob.sync("/Users/wph95/hackathon/2021/base_docs/flink/**/*.zh.md", {}).map(file=>processFile(file))

console.log(`total: ${total.length}`)
let rules = {}

let fatal= {};
total.map(msg=>{
  if (rules[msg.ruleId]){
    rules[msg.ruleId].push(msg)
  }else {
    rules[msg.ruleId] = []
  }

  fatal[msg.fatal] = (fatal[msg.fatal] || 0)+1

})

for (let rulesKey in rules) {
  console.log(rulesKey, rules[rulesKey].length)
}

for (let v in fatal){
  console.log(v, fatal[v])
}


let sen = 0;
let char = 0;
for (let count of files.counts) {
  char += count.char || 0
  sen += count.sen || 0
}

console.log(`total sen:${sen}, char:${char}`)

// processFile("/Users/wph95/hackathon/2021/base_docs/docs-cn/whats-new-in-tidb-4.0.md")