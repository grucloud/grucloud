const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  pick(["analyzerName", "ruleName"]),
  tap(({ analyzerName, ruleName }) => {
    assert(analyzerName);
    assert(ruleName);
  }),
]);

const findName = () =>
  pipe([
    tap(({ analyzerName, ruleName }) => {
      assert(analyzerName);
      assert(ruleName);
    }),
    ({ analyzerName, ruleName }) => `${analyzerName}::${ruleName}`,
  ]);

exports.AccessAnalyzerArchiveRule = ({ compare }) => ({
  type: "ArchiveRule",
  package: "accessanalyzer",
  client: "AccessAnalyzer",
  inferName:
    ({ dependenciesSpec: { analyzer } }) =>
    ({ ruleName }) =>
      pipe([
        tap((params) => {
          assert(analyzer);
          assert(ruleName);
        }),
        () => `${analyzer}::${ruleName}`,
      ])(),
  findName,
  findId: findName,
  propertiesDefault: {},
  omitProperties: ["createdAt", "updatedAt", "analyzerName"],
  dependencies: {
    analyzer: {
      type: "Analyzer",
      group: "AccessAnalyzer",
      parent: true,
      dependencyId: () => pipe([get("analyzerName")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AccessAnalyzer.html#getArchiveRule-property
  getById: {
    method: "getArchiveRule",
    getField: "archiveRule",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AccessAnalyzer.html#createArchiveRule-property
  create: {
    method: "createArchiveRule",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AccessAnalyzer.html#deleteArchiveRule-property
  destroy: {
    method: "deleteArchiveRule",
    pickId,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Analyzer", group: "AccessAnalyzer" },
          pickKey: pipe([pick(["analyzerName"])]),
          method: "listArchiveRules",
          getParam: "archiveRules",
          config,
          decorate: ({ parent }) =>
            pipe([defaultsDeep({ analyzerName: parent.analyzerName })]),
        }),
    ])(),
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { analyzer },
  }) =>
    pipe([
      tap((params) => {
        assert(analyzer);
        assert(analyzer.config.analyzerName);
      }),
      () => otherProps,
      defaultsDeep({ analyzerName: analyzer.config.analyzerName }),
    ])(),
});
