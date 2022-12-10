const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity, callProp } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const {
  tagResource,
  untagResource,
  assignTags,
  managedByEFS,
} = require("./BackupCommon");

const buildArn = () => get("BackupPlanArn");

//TODO
const decorate = ({ endpoint, live }) =>
  pipe([defaultsDeep(live), assignTags({ endpoint, buildArn: buildArn() })]);

// EFS FileSystem
const managedByOther = () => pipe([managedByEFS]);

const pickId = pipe([pick(["BackupPlanId"])]);

const model = ({ config }) => ({
  package: "backup",
  client: "Backup",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#getBackupPlan-property
  getById: {
    method: "getBackupPlan",
    pickId,
    getField: "BackupPlan",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#listBackupPlans-property
  getList: {
    method: "listBackupPlans",
    getParam: "BackupPlansList",
    decorate: ({ getById, endpoint }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#createBackupPlan-property
  create: {
    method: "createBackupPlan",
    pickCreated: ({ payload }) => pipe([identity]),
    filterPayload: ({ Tags, ...other }) =>
      pipe([() => ({ BackupPlan: other, BackupPlanTags: Tags })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#updateBackupPlan-property
  update: {
    method: "updateBackupPlan",
    filterParams: ({ payload: { Tags, ...other }, live }) =>
      pipe([
        () => ({ BackupPlan: other, BackupPlanTags: Tags }),
        defaultsDeep({ BackupPlanId: live.BackupPlanId }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#deleteBackupPlan-property
  destroy: {
    method: "deleteBackupPlan",
    pickId,
  },
});

exports.BackupBackupPlan = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    managedByOther,
    cannotBeDeleted: managedByOther,
    findName: () => pipe([get("BackupPlanName")]),
    findId: () => pipe([get("BackupPlanId")]),
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
