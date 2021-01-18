import { inspect } from "util";

const vfile = require("to-vfile");
const Chinese = require("./parser/parser");
const remark = require("remark");
const gfm = require("remark-gfm");
const frontmatter = require("remark-frontmatter");
var remark2retext = require("remark-retext");
var unified = require("unified");
import { ZH417 } from "./rule/zh/ZH417";
import { ZH400 } from "./rule/zh/ZH400";
import { ZH403 } from "./rule/zh/ZH403";
import { Inspect } from "./rule/zh/inspect";
import { ZH416 } from "./rule/zh/ZH416";
import {ZH418} from "./rule/zh/ZH418";
import { ZH414 } from "./rule/zh/ZH414";
import { ZH410 } from "./rule/zh/ZH410";
import { ZH420_423 } from "./rule/zh/ZH420_423";
import { ZHError } from "./rule/zh/error";
import { ZH425 } from "./rule/zh/ZH425";
var stringify = require("remark-stringify");
var report = require("vfile-reporter");

var test = require("tape");

function process(doc) {
  return remark()
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
        .use(Inspect)
    )
    .use(stringify)
    .processSync(vfile({ path: "virtual.md", contents: doc }));
}


const startFullTest = ()=>{

  test("ZH403", function(t) {
    t.test("should support no rules", st => {
      st.plan(1);
      const output = process(
        "这是一个桔子，那也是个桔子，具体详情看：http://zh.md，详细内容："
      );
      st.deepEqual(
        "sentence colon'：' count:2, bigger than limit:1",
        output.messages[0].message)
    });
  });


  test("ZH400", function(t) {
    t.test("should support no rules", st => {
      st.plan(1);
      const output = process(
        "这是一个桔子，他的，数量很多，巴巴，巴巴，他们都去,哪里了，呀？"
      );
      st.deepEqual(
        "sentence comma count:7, bigger than limit:6",
        output.messages[0].message)
    });
  });

  test("ZH417", function(t) {
    t.test("should support no rules", st => {
      st.plan(1);
      const output = process(
        "english sen can't use “it\". "
      );
      st.deepEqual(
        output.messages[0].message,
        "shouldn't use full-width char:'“' in en sentence"
      )
    });
  })



  test("ZH416", function(t) {
    t.test("should support no rules", st => {
      st.plan(2);
      let output = process("哇！啪一下，很快的啊");
      st.deepEqual(
        output.messages[0].message,
        "sentence end need an ending punctuation"
      )
      output = process("哇！啪一下，很快的啊，");
      st.deepEqual(
        output.messages[0].message,
        "sentence ending punctuation '，' is illegal"
      )
    });
  });

  test("ZH418", function(t) {
    t.test("should support no rules", st => {
      st.plan(1);
      let output = process("哇！啪一下，很快的啊, 居然你想用英文逗号。");
      st.deepEqual(
        output.messages[0].message,
        "shouldn't use half-width char:',' in cn sentence"
      )
    });
  });


  test("shortcode", function(t) {
    t.test("should support no rules", st => {
      st.plan(1);
      let output = process(shortcodetext);
      st.deepEqual(
        output.messages.length, 0
      )
    });
  })


  test("英文省略号在中文语境中使用", function(t) {
    t.test("should throw error", st => {
      st.plan(1);
      let output = process("大爷你该走哪？走二仙桥！谭警官：...");
      st.deepEqual(
        output.messages[0].ruleId,  `ZH412`
      )
    });
  })


  test("EN414", function(t) {
    t.test("should throw error", st => {
      st.plan(2);
      let output = process("接/化 / 发，不讲武德？no jiang / wu / de");
      st.deepEqual(
        output.messages.length,  6
      )
      st.deepEqual(output.messages[0].ruleId,  `ZH414`)
    });
  })

  test("EN410", function(t) {
    t.test("should throw error", st => {
      st.plan(2);
      let output = process("哇，是破-折 ——号！");
      st.deepEqual(
        output.messages.length,  1
      )
      st.deepEqual(output.messages[0].ruleId,  `ZH410`)
    });
  })


  test("括号", function(t) {
    t.test("ZH403should throw error", st => {
      st.plan(2);
      let output = process("这是一个测试句子（啥这是一个测试句子？");
      msgTest(st, output.messages[0], "miss right parenthesis", "ZH403")
    });

    t.test("ZH403should throw error", st => {
      st.plan(2);
      let output = process("这是一个测试句子（这（啥这是一个测试句子？");
      msgTest(st, output.messages[0], "miss right parenthesis", "ZH403")
    });

    t.test("ZH403should throw error", st => {
      st.plan(2);
      let output = process("这是一个测试句子啥这是一个测试）句子？");
      msgTest(st, output.messages[0], "miss left parenthesis", "ZH403")
    });

    t.test("424 中文括号内容使用半角括号", st => {
      st.plan(4);
      let output = process("这是一个测试句 (子啥这是一个测试) 句子？");
      msgTest(st, output.messages[0], "in cn sen, left parenthesis should full-width", "ZH424")
      msgTest(st, output.messages[1], "in cn sen, right parenthesis should full-width", "ZH424")
    });

    t.test("423 括号内中文内容", st => {
      st.plan(6);
      let output = process("这是一个测试句 （子啥这是一个测试） 句子？");
      msgTest(st, output.messages[0], "before left parenthesis have whitespace", "ZH423")
      msgTest(st, output.messages[1], "after right parenthesis have whitespace", "ZH423")
      output = process("（子啥这是一个测试） 句子？");
      msgTest(st, output.messages[0], "after right parenthesis have whitespace", "ZH423")
    });

    t.test("423 括号内英文内容", st => {
      st.plan(12);
      let output = process("这是一个测试句（hello world）句子？");
      msgTest(st, output.messages[0], ZHError.ZH420L, "ZH420")
      msgTest(st, output.messages[1], ZHError.ZH420R, "ZH420")
      output = process("这是一个测试句(hello world)句子？");
      msgTest(st, output.messages[0], ZHError.ZH421L, "ZH421")
      msgTest(st, output.messages[1], ZHError.ZH421R, "ZH421")
      output = process("这是一个测试句 ( hello world ) 句子？");
      msgTest(st, output.messages[0], ZHError.ZH422L, "ZH422")
      msgTest(st, output.messages[1], ZHError.ZH422R, "ZH422")
    });

  })


  test("ZH425", function(t) {
    t.test("should throw error", st => {
      st.plan(8);
      let output = process("请将具体的日志 提供给 TiDB 开发者。");
      msgTest(st,output.messages[0], ZHError.ZH426, "ZH426")
      output = process("请将具体的日志提供给  TiDB 开发者。");
      msgTest(st,output.messages[0], ZHError.ZH425, "ZH425")
      output = process("请将具体的日志提供给， TiDB 开发者。");
      msgTest(st,output.messages[0], ZHError.ZH427, "ZH427")
      output = process("这好吗？ 这不好。这不讲武德！");
      msgTest(st,output.messages[0], ZHError.ZH428, "ZH428")
    });
  })

}

// startFullTest()


function msgTest(st, msg, exceptMsg, exceptID){
  st.deepEqual(msg.message, exceptMsg)
  st.deepEqual(msg.ruleId, exceptID)
}


// test("test", function(t) {
//   t.test("should throw error", st => {
//     st.plan(2);
//     let output = process("能够组成标识符 (identifier) 的字符");
//     st.deepEqual(
//       output.messages.length,  1
//     )
//     st.deepEqual(output.messages[0].ruleId,  `ZH410`)
//   });
// })

let output = process("这是一个测试句（hello world）句子？");

const shortcodetext = `hello, my name is li lin.

{{< copyable "sql" >}}

\`\`\`sql
SET @favorite_db = 'TiDB';
\`\`\`

{{< copyable "sql" >}}
 
 
{{< copyable "sql" >}}
\`\`\`sql
SET @a = 'a', @b = 'b', @c = 'c';
\`\`\`

其中赋值符号还可以使用 \`:=\`。
`