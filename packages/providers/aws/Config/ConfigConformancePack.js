const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const {
  conformancePackdependencies,
  conformanceDecorate,
  conformanceCreate,
} = require("./ConfigServiceCommon");

const pickId = pipe([
  tap(({ ConformancePackName }) => {
    assert(ConformancePackName);
  }),
  pick(["ConformancePackName"]),
]);

const decorate = conformanceDecorate({
  describeConformancePackStatus: "describeConformancePackStatus",
  ConformancePackStatusDetails: "ConformancePackStatusDetails",
});

exports.ConfigConformancePack = ({}) => ({
  type: "ConformancePack",
  package: "config-service",
  client: "ConfigService",
  inferName: () => get("ConformancePackName"),
  findName: () => pipe([get("ConformancePackName")]),
  findId: () => pipe([get("ConformancePackName")]),
  ignoreErrorCodes: ["NoSuchConformancePackException"],
  propertiesDefault: {},
  omitProperties: [
    "LastUpdateRequestedTime",
    "ConformancePackArn",
    "ConformancePackId",
    "ConformancePackState",
    "ConformancePackStatusReason",
    "LastUpdateCompletedTime",
    "StackArn",
    "Rules[].ComplianceType",
    "Rules[].Controls",
  ],
  dependencies: conformancePackdependencies,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeConformancePacks-property
  getById: {
    method: "describeConformancePacks",
    pickId: pipe([
      tap(({ ConformancePackName }) => {
        assert(ConformancePackName);
      }),
      ({ ConformancePackName }) => ({
        ConformancePackNames: [ConformancePackName],
      }),
    ]),
    getField: "ConformancePackDetails",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#describeConformancePacks-property
  getList: {
    method: "describeConformancePacks",
    getParam: "ConformancePackDetails",
    decorate,
  },
  create: conformanceCreate({ putConformancePack: "putConformancePack" }),
  update: {
    method: "putConformancePack",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ConfigService.html#deleteConformancePack-property
  destroy: {
    method: "deleteConformancePack",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { s3BucketDelivery, s3BucketTemplate },
    config,
  }) =>
    pipe([
      () => otherProps,
      when(
        () => s3BucketDelivery,
        assign({ DeliveryS3Bucket: () => s3BucketDelivery.config.Name })
      ),
      when(
        () => s3BucketTemplate,
        assign({ TemplateS3Uri: () => s3BucketTemplate.config.Name })
      ),
    ])(),
});
