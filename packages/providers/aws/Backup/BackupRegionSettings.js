const assert = require("assert");
const { pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
]);

const model = ({ config }) => ({
  package: "backup",
  client: "Backup",
  ignoreErrorCodes: [],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#describeRegionSettings-property
  getById: {
    method: "describeRegionSettings",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#describeRegionSettings-property
  getList: {
    method: "describeRegionSettings",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#updateRegionSettings-property
  create: {
    method: "updateRegionSettings",
    pickCreated: ({ payload }) => pipe([() => payload]),
    filterPayload: ({ lives }) => pipe([]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#updateRegionSettings-property
  update: {
    method: "updateRegionSettings",
    filterParams: ({ payload, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#updateRegionSettings-property
  destroy: {
    method: "updateRegionSettings",
    pickId: () => ({
      //RegionSettings: { isCrossAccountBackupEnabled: "false" },
    }),
    isInstanceDown: () => true,
  },
});

exports.BackupRegionSettings = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    cannotBeDeleted: () => true,
    findName: pipe([() => "region"]),
    findId: pipe([() => "region"]),
    getByName: getByNameCore,
    configDefault: ({
      name,
      namespace,
      properties: { ...otherProps },
      dependencies: {},
    }) => pipe([() => otherProps, defaultsDeep({})])(),
  });
