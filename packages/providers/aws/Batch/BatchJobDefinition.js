const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const {
  defaultsDeep,
  callProp,
  unless,
  append,
  isEmpty,
  identity,
} = require("rubico/x");
const { buildTagsObject, omitIfEmpty } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource } = require("./BatchCommon");

const buildArn = () => get("jobDefinitionArn");

const pickId = pipe([
  tap(({ jobDefinitionArn }) => {
    assert(jobDefinitionArn);
  }),
  ({ jobDefinitionArn }) => ({
    jobDefinition: jobDefinitionArn,
  }),
]);

const cannotBeDeleted = () => pipe([eq(get("status"), "INACTIVE")]);

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
    pickId: pipe([pickId, defaultsDeep({ status: "ACTIVE" })]),
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
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([eq(get("status"), "ACTIVE")]),
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
    findName: () => pipe([get("jobDefinitionName")]),
    findName:
      ({ lives }) =>
      (live) =>
        pipe([
          () => live,
          get("jobDefinitionName"),
          unless(
            eq(() => live.status, "ACTIVE"),
            append(`::${live.revision}`)
          ),
        ])(),
    findId: () => pipe([get("jobDefinitionArn")]),
    cannotBeDeleted,
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
