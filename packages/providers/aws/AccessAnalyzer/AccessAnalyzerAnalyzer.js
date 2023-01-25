const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger } = require("./AccessAnalyzerCommon");

const buildArn = () => get("arn");

const pickId = pipe([pick(["analyzerName"])]);

const decorate =
  () =>
  ({ name, ...other }) => ({ analyzerName: name, ...other });

exports.AccessAnalyzerAnalyzer = ({ compare }) => ({
  type: "Analyzer",
  package: "accessanalyzer",
  client: "AccessAnalyzer",
  inferName: () =>
    pipe([
      get("analyzerName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () => pipe([get("analyzerName")]),
  findId: () => pipe([get("analyzerName")]),
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "createdAt",
    "lastResourceAnalyzed",
    "lastResourceAnalyzedAt",
    "status",
    "statusReason",
  ],
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AccessAnalyzer.html#getAnalyzer-property
  getById: {
    method: "getAnalyzer",
    getField: "analyzer",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AccessAnalyzer.html#listAnalyzers-property
  getList: {
    method: "listAnalyzers",
    getParam: "analyzers",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AccessAnalyzer.html#createAnalyzer-property
  create: {
    method: "createAnalyzer",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: eq(get("status"), "ACTIVE"),
    isInstanceError: eq(get("status"), "FAILED"),
    getErrorMessage: get("statusReason.code", "failed"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AccessAnalyzer.html#deleteAnalyzer-property
  destroy: {
    method: "deleteAnalyzer",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
