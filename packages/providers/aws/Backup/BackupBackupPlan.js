const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger, assignTags, managedByEFS } = require("./BackupCommon");

const buildArn = () => get("BackupPlanArn");

//TODO
const decorate = ({ endpoint, live }) =>
  pipe([defaultsDeep(live), assignTags({ endpoint, buildArn: buildArn() })]);

// EFS FileSystem
const managedByOther = () => pipe([managedByEFS]);

const pickId = pipe([pick(["BackupPlanId"])]);

exports.BackupBackupPlan = ({}) => ({
  type: "BackupPlan",
  package: "backup",
  client: "Backup",
  inferName: () => get("BackupPlanName"),
  findName: () => pipe([get("BackupPlanName")]),
  findId: () => pipe([get("BackupPlanId")]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  getByName: getByNameCore,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  propertiesDefault: {},
  omitProperties: [
    "BackupPlanArn",
    "BackupPlanId",
    "CreationDate",
    "VersionId",
    "Rules[].RuleId",
    "CreatorRequestId",
  ],
  dependencies: {
    backupVaults: {
      type: "BackupVault",
      group: "Backup",
      list: true,
      excludeDefaultDependencies: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Rules"),
          map(
            pipe([
              get("TargetBackupVaultName"),
              lives.getByName({
                type: "BackupVault",
                group: "Backup",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
        ]),
    },
  },
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
