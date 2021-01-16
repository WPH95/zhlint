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


  const shortcodetext = `
hello, my name is li lin.

{{< copyable "sql" >}}


\`\`\`sql
SET @favorite_db = 'TiDB';
\`\`\`

{{< copyable "sql" >}}

\`\`\`sql
SET @a = 'a', @b = 'b', @c = 'c';
\`\`\`

其中赋值符号还可以使用 \`:=\`。例如

`
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


  test("-> to signal", function(t) {
    t.test("should throw error", st => {
      st.plan(1);
      let output = process("快车道 -> 二仙桥 <-> 成华大道");

    });
  })



}

// startFullTest()

test("-> to signal", function(t) {
  t.test("should throw error", st => {
    st.plan(1);
    let output = process("快车道 -> 二仙桥 <-> 成华大道");

  });
})



// test("test", function(t) {
//   t.test("should throw error", st => {
//     st.plan(2);
//     let output = process("哇，是破-折 ——号！");
//     st.deepEqual(
//       output.messages.length,  1
//     )
//     st.deepEqual(output.messages[0].ruleId,  `ZH410`)
//   });
// })
