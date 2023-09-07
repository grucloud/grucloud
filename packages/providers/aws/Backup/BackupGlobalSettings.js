const assert = require("assert");
const { pipe, tap, eq, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
]);

const cannotBeDeleted = () =>
  pipe([eq(get("isCrossAccountBackupEnabled"), "false")]);

exports.BackupGlobalSettings = ({ spec, config }) => ({
  type: "GlobalSettings",
  package: "backup",
  client: "Backup",
  inferName: () => () => "global",
  findName: () => pipe([() => "global"]),
  findId: () => pipe([() => "global"]),
  propertiesDefault: {},
  omitProperties: ["LastUpdateTime"],
  ignoreResource: () =>
    pipe([get("live"), eq(get("isCrossAccountBackupEnabled"), "false")]),
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  ignoreErrorCodes: [],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#describeGlobalSettings-property
  getById: {
    method: "describeGlobalSettings",
    getField: "GlobalSettings",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#describeGlobalSettings-property
  getList: {
    method: "describeGlobalSettings",
    getParam: "GlobalSettings",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#updateGlobalSettings-property
  create: {
    method: "updateGlobalSettings",
    pickCreated: ({ payload }) => pipe([() => payload]),
    filterPayload: (GlobalSettings) => ({ GlobalSettings }),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#updateGlobalSettings-property
  update: {
    method: "updateGlobalSettings",
    filterParams: ({ payload, live }) =>
      pipe([() => ({ GlobalSettings: payload })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#updateGlobalSettings-property
  destroy: {
    method: "updateGlobalSettings",
    pickId: () => ({
      GlobalSettings: { isCrossAccountBackupEnabled: "false" },
    }),
    isInstanceDown: () => true,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
