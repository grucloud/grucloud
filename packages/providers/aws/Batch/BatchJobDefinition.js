const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, callProp, unless, append, isEmpty } = require("rubico/x");
const { buildTagsObject, omitIfEmpty } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource } = require("./BatchCommon");

const buildArn = () => get("jobDefinitionArn");

const pickId = pipe([
  ({ jobDefinitionArn }) => ({
    jobDefinition: jobDefinitionArn,
  }),
]);

const decorate = () =>
  pipe([
    omitIfEmpty([
      "containerProperties.environment",
      "containerProperties.mountPoints",
      "containerProperties.secrets",
      "containerProperties.ulimits",
      "containerProperties.volumes",
      "parameters",
    ]),
  ]);

const model = ({ config }) => ({
  package: "batch",
  client: "Batch",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#describeJobDefinitions-property
  getById: {
    method: "describeJobDefinitions",
    pickId: pipe([
      ({ jobDefinitionArn }) => ({
        jobDefinitions: [jobDefinitionArn],
      }),
    ]),
    getField: "jobDefinitions",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#describeJobDefinitions-property
  getList: {
    method: "describeJobDefinitions",
    getParam: "jobDefinitions",
    decorate,
    transformListPost: () =>
      pipe([
        callProp("sort", (a, b) => b.revision - a.revision),
        unless(isEmpty, ([latestItem, ...others]) => [
          { ...latestItem, latest: true },
          ...others,
        ]),
        callProp("reverse"),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#registerJobDefinition-property
  create: {
    method: "registerJobDefinition",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: eq(get("status"), "ACTIVE"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#updateJobDefinition-property
  update: {
    method: "registerJobDefinition",
    filterParams: ({ payload, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#deregisterJobDefinition-property
  destroy: {
    method: "deregisterJobDefinition",
    pickId,
    isInstanceDown: eq(get("status"), "INACTIVE"),
  },
});

exports.BatchJobDefinition = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.jobDefinitionName")]),
    findName: ({ live, lives }) =>
      pipe([
        () => live,
        get("jobDefinitionName"),
        unless(() => live.latest, append(`::${live.revision}`)),
      ])(),
    findId: pipe([get("live.jobDefinitionArn")]),
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
      dependencies: { roleExecution },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          tags: buildTagsObject({ name, config, namespace, userTags: tags }),
          containerProperties: {
            executionRoleArn: getField(roleExecution, "Arn"),
          },
        }),
      ])(),
  });
