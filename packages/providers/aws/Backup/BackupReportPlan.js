const assert = require("assert");
const { pipe, tap, get, pick, assign, eq, map } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { buildTagsObject, omitIfEmpty } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./BackupCommon");

const buildArn = () => get("ReportPlanArn");
//TODO

const decorate = ({ endpoint, live }) =>
  pipe([
    defaultsDeep(live),
    assignTags({ endpoint, buildArn: buildArn() }),
    assign({
      ReportDeliveryChannel: pipe([
        get("ReportDeliveryChannel"),
        assign({
          Formats: pipe([
            get("Formats"),
            callProp("sort", (a, b) => a.localeCompare(b)),
          ]),
        }),
      ]),
    }),
    omitIfEmpty([
      "ReportSetting.Accounts",
      "ReportSetting.OrganizationUnits",
      "ReportSetting.Regions",
    ]),
  ]);

const pickId = pipe([pick(["ReportPlanName"])]);

exports.BackupReportPlan = ({}) => ({
  type: "ReportPlan",
  package: "backup",
  client: "Backup",
  inferName: () => get("ReportPlanName"),
  findName: () => pipe([get("ReportPlanName")]),
  findId: () => pipe([get("ReportPlanName")]),
  getByName: getByNameCore,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  propertiesDefault: {},
  omitProperties: [
    "ReportPlanArn",
    "CreationTime",
    "DeploymentStatus",
    "LastAttemptedExecutionTime",
    "LastSuccessfulExecutionTime",
    "ReportSetting.NumberOfFrameworks",
  ],

  dependencies: {
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([get("ReportDeliveryChannel.S3BucketName")]),
    },
    frameworks: {
      type: "Framework",
      group: "Backup",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("ReportSetting.FrameworkArns")]),
    },
  },
  filterLive: ({ providerConfig, lives }) =>
    pipe([
      assign({
        ReportSetting: pipe([
          get("ReportSetting"),
          assign({
            FrameworkArns: pipe([
              get("FrameworkArns"),
              map(
                pipe([
                  replaceWithName({
                    groupType: "Backup::Framework",
                    path: "id",
                    providerConfig,
                    lives,
                  }),
                ])
              ),
            ]),
          }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#describeReportPlan-property
  getById: {
    method: "describeReportPlan",
    pickId,
    getField: "ReportPlan",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#listReportPlans-property
  getList: {
    method: "listReportPlans",
    getParam: "ReportPlans",
    decorate: ({ getById, endpoint }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#createReportPlan-property
  create: {
    method: "createReportPlan",
    pickCreated: ({ payload }) => pipe([() => payload]),
    filterPayload: ({ Tags, ...other }) =>
      pipe([() => ({ ...other, ReportPlanTags: Tags })])(),
    isInstanceUp: pipe([eq(get("DeploymentStatus"), "COMPLETED")]),
    isInstanceError: pipe([eq(get("DeploymentStatus"), "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#updateReportPlan-property
  update: {
    method: "updateReportPlan",
    filterParams: ({ payload, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#deleteReportPlan-property
  destroy: {
    method: "deleteReportPlan",
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
