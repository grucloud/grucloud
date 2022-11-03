const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource, assignTags } = require("./BackupCommon");

const buildArn = () => get("FrameworkArn");
//TODO

const decorate = ({ endpoint, live }) =>
  pipe([defaultsDeep(live), assignTags({ endpoint, buildArn: buildArn() })]);

const pickId = pipe([pick(["FrameworkName"])]);

const model = ({ config }) => ({
  package: "backup",
  client: "Backup",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#describeFramework-property
  getById: {
    method: "describeFramework",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#listFrameworks-property
  getList: {
    method: "listFrameworks",
    getParam: "Frameworks",
    decorate: ({ getById, endpoint }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#createFramework-property
  create: {
    method: "createFramework",
    pickCreated: ({ payload }) => pipe([identity]),
    filterPayload: ({ Tags, ...other }) =>
      pipe([() => ({ ...other, FrameworkTags: Tags })])(),
    isInstanceUp: eq(get("DeploymentStatus"), "COMPLETED"),
    isInstanceError: eq(get("DeploymentStatus"), "FAILED"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#updateFramework-property
  update: {
    method: "updateFramework",
    filterParams: ({ payload, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#deleteFramework-property
  destroy: {
    method: "deleteFramework",
    pickId,
  },
});

exports.BackupFramework = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.FrameworkName")]),
    findId: pipe([get("live.FrameworkArn")]),
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
      properties: { Tags, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          Tags: buildTagsObject({
            name,
            config,
            namespace,
            userTags: Tags,
          }),
        }),
      ])(),
  });
