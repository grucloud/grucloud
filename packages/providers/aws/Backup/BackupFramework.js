const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./BackupCommon");

const buildArn = () => get("FrameworkArn");
//TODO

const decorate = ({ endpoint, live }) =>
  pipe([defaultsDeep(live), assignTags({ endpoint, buildArn: buildArn() })]);

const pickId = pipe([pick(["FrameworkName"])]);

exports.BackupFramework = ({}) => ({
  type: "Framework",
  package: "backup",
  client: "Backup",
  inferName: () => get("FrameworkName"),
  findName: () => pipe([get("FrameworkName")]),
  findId: () => pipe([get("FrameworkArn")]),
  propertiesDefault: {},
  omitProperties: [
    "FrameworkStatus",
    "FrameworkArn",
    "DeploymentStatus",
    "NumberOfControls",
    "CreationTime",
  ],
  getByName: getByNameCore,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    configurationRecorder: {
      type: "ConfigurationRecorder",
      group: "Config",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
  },
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
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
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
