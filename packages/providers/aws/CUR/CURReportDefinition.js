const assert = require("assert");
const { pipe, tap, get, assign, pick, map, or, eq } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

const pickId = pipe([
  pick(["ReportName"]),
  tap(({ ReportName }) => {
    assert(ReportName);
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

const model = ({ config }) => ({
  package: "cost-and-usage-report-service",
  client: "CostAndUsageReportService",
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CUR.html#describeCUR-property
  getList: {
    method: "describeReportDefinitions",
    getParam: "ReportDefinitions",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CUR.html#putReportDefinition-property
  create: {
    method: "putReportDefinition",
    filterPayload: pipe([(ReportDefinition) => ({ ReportDefinition })]),
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CUR.html#modifyReportDefinition-property
  update: {
    method: "modifyReportDefinition",
    filterParams: ({ payload: { ReportName, ...ReportDefinition }, live }) =>
      pipe([() => ({ ReportName, ReportDefinition })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CUR.html#deleteReportDefinition-property
  destroy: {
    method: "deleteReportDefinition",
    pickId,
  },
});

exports.CURReportDefinition = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: pipe([get("live.ReportName")]),
    findId: pipe([get("live.ReportName")]),
    getByName: getByNameCore,
    getById:
      ({ endpoint }) =>
      (live) =>
        pipe([
          tap((params) => {
            assert(live);
          }),
          endpoint().describeReportDefinitions,
          get("ReportDefinitions"),
          find(eq(get("ReportName"), live.ReportName)),
          tap((params) => {
            assert(true);
          }),
        ])(),
    configDefault: ({
      name,
      namespace,
      properties: { ...otherProps },
      dependencies: { s3Bucket },
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({ S3Bucket: s3Bucket.config.Name }),
      ])(),
  });
