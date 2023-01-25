const assert = require("assert");
const { pipe, tap, get, assign, pick, map, or, eq } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");

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
    omitIfEmpty(["AdditionalArtifacts"]),
  ]);

exports.CURReportDefinition = ({}) => ({
  type: "ReportDefinition",
  package: "cost-and-usage-report-service",
  client: "CostAndUsageReportService",
  inferName: () => get("ReportName"),
  findName: () => pipe([get("ReportName")]),
  findId: () => pipe([get("ReportName")]),
  ignoreErrorCodes: ["NotFoundException"],
  propertiesDefault: {},
  omitProperties: [],
  dependencies: {
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          get("S3Bucket"),
        ]),
    },
  },
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
  getByName: getByNameCore,
  getById:
    ({ endpoint }) =>
    ({ lives }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(live);
        }),
        () => ({}),
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
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({ S3Bucket: s3Bucket.config.Name }),
    ])(),
});
