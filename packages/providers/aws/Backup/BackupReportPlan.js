const assert = require("assert");
const { pipe, tap, get, pick, assign, eq } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");
const { buildTagsObject, omitIfEmpty } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const { tagResource, untagResource, assignTags } = require("./BackupCommon");

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

const model = ({ config }) => ({
  package: "backup",
  client: "Backup",
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
});

exports.BackupReportPlan = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("ReportPlanName")]),
    findId: () => pipe([get("ReportPlanName")]),
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
