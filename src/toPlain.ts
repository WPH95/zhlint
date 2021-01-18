import { Root, Sentence } from "nlcst-types";
const vfile = require("to-vfile");
const toNlcst = require("mdast-util-to-nlcst");
const inspect = require("unist-util-inspect");
const Chinese = require("./parser/parser");

const ChineseParser = require("./parser/parse-chinese");
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
import {doc} from "prettier";
import printDocToString = doc.printer.printDocToString;
import join = doc.builders.join;
import {log} from "util";
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



  ).use(stringify)

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
var nodeToStr = require("nlcst-to-string");
var English = require('parse-english')
var fs = require('fs')

function processFile(path){

  const file =vfile.readSync(path)
  const remark_zh =remark()
    .use(gfm)
    .use(frontmatter, ["yaml", "toml"])
    .parse(file)
  var mdast = remark().parse(file)

  // const writer = console.log
  let tmp = path.split("/")
  tmp[tmp.indexOf("docs")] = "docs-plain"
  // tmp[tmp.indexOf("docs-cn")] = "docs-cn-plain"
  var logger = fs.createWriteStream(tmp.join("/")+".txt")
  console.log(tmp.join("/")+".txt")
  const writeln = (l)=>logger.write(l+"\n")
  for (let node of mdast.children) {
    writeln(`${node.position.start.line}-${node.position.end.line}, ${node.type}, ${node.depth||""}`)
    if (node.type==="list"){
      for (let item of node.children) {
        writeln(nodeToStr(toNlcst(item, file, ChineseParser)))
      }
    }else{
      writeln(nodeToStr(toNlcst(node, file, ChineseParser)))
    }
    writeln("---")

  }
  logger.close()

}


// processFile("/Users/wph95/hackathon/2021/base_docs/docs-cn/whats-new-in-tidb-4.0.md")
processFile("/Users/wph95/hackathon/2021/base_docs/docs/whats-new-in-tidb-4.0.md")




// var glob = require("glob")
//
// glob.sync("/Users/wph95/hackathon/2021/base_docs/docs/*.md", {}).map(file=>processFile(file))
// console.log(`total: ${total.length}`)
// let rules = {}
//
// total.map(msg=>{
//   if (rules[msg.ruleId]){
//     rules[msg.ruleId].push(msg)
//   }else {
//     rules[msg.ruleId] = []
//   }
// })
//
// for (let rulesKey in rules) {
//   console.log(rulesKey, rules[rulesKey].length)
//
// }


// processFile("/Users/wph95/hackathon/2021/base_docs/docs/views.md")


