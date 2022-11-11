const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "AccessAnalyzer";
const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

const { AccessAnalyzerAnalyzer } = require("./AccessAnalyzerAnalyzer");
const { AccessAnalyzerArchiveRule } = require("./AccessAnalyzerArchiveRule");

module.exports = pipe([
  () => [
    {
      type: "Analyzer",
      Client: AccessAnalyzerAnalyzer,
      propertiesDefault: {},
      omitProperties: [
        "arn",
        "createdAt",
        "lastResourceAnalyzed",
        "lastResourceAnalyzedAt",
        "status",
        "statusReason",
      ],
      inferName: get("properties.analyzerName"),
    },
    {
      type: "ArchiveRule",
      Client: AccessAnalyzerArchiveRule,
      propertiesDefault: {},
      omitProperties: ["createdAt", "updatedAt", "analyzerName"],
      inferName: ({
        properties: { ruleName },
        dependenciesSpec: { analyzer },
      }) =>
        pipe([
          tap((params) => {
            assert(analyzer);
            assert(ruleName);
          }),
          () => `${analyzer}::${ruleName}`,
        ])(),
      dependencies: {
        analyzer: {
          type: "Analyzer",
          group: "AccessAnalyzer",
          parent: true,
          dependencyId: () => pipe([get("analyzerName")]),
        },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
