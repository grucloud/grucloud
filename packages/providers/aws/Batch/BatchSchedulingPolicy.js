const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource } = require("./BatchCommon");

const buildArn = () => get("arn");

const model = ({ config }) => ({
  package: "batch",
  client: "Batch",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#describeSchedulingPolicies-property
  getById: {
    method: "describeSchedulingPolicies",
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      ({ arn }) => ({
        arns: [arn],
      }),
    ]),
    getField: "schedulingPolicies",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#listSchedulingPolicies-property
  getList: {
    method: "listSchedulingPolicies",
    getParam: "schedulingPolicies",
    decorate: ({ getById }) => getById,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#createSchedulingPolicy-property
  create: {
    method: "createSchedulingPolicy",
    pickCreated: ({ payload }) => identity,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#updateSchedulingPolicy-property
  update: {
    method: "updateSchedulingPolicy",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ arn: live.arn })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#deleteSchedulingPolicy-property
  destroy: {
    method: "deleteSchedulingPolicy",
    pickId: pick(["arn"]),
  },
});

exports.BatchSchedulingPolicy = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("name")]),
    findId: () => pipe([get("arn")]),
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
