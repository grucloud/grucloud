const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");
const { compareAws } = require("../AwsCommon");

const GROUP = "AccessAnalyzer";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

const { AccessAnalyzerAnalyzer } = require("./AccessAnalyzerAnalyzer");
const { AccessAnalyzerArchiveRule } = require("./AccessAnalyzerArchiveRule");

module.exports = pipe([
  () => [
    //
    AccessAnalyzerAnalyzer({}),
    AccessAnalyzerArchiveRule({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
