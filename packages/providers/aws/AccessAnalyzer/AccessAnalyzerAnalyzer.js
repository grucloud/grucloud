const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource } = require("./AccessAnalyzerCommon");

const buildArn = () => get("arn");

const pickId = pipe([pick(["analyzerName"])]);

const decorate =
  () =>
  ({ name, ...other }) => ({ analyzerName: name, ...other });

const model = ({ config }) => ({
  package: "accessanalyzer",
  client: "AccessAnalyzer",
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
});

exports.AccessAnalyzerAnalyzer = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.analyzerName")]),
    findId: pipe([get("live.analyzerName")]),
    getByName: getByNameCore,
    tagResource: tagResource({
      buildArn: buildArn(config),
    }),
    untagResource: untagResource({
      buildArn: buildArn(config),
    }),
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          tags: buildTagsObject({ name, config, namespace, userTags: tags }),
        }),
      ])(),
  });
