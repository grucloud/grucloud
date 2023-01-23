const assert = require("assert");
const { pipe, tap, get, pick, fork, assign } = require("rubico");
const { defaultsDeep, when, first } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ ConformancePackName }) => {
    assert(ConformancePackName);
  }),
  pick(["ConformancePackName"]),
]);

const decorate =
  ({ endpoint, parent, lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        //assert(lives);
      }),

      () => live,
      fork({
        TemplateBody: pipe([
          ({ ConformancePackName, ConformancePackId }) =>
            `awsconfigconforms-${ConformancePackName}-${ConformancePackId}`,
          lives.getByName({
            type: "Stack",
            group: "CloudFormation",
            providerName: config.providerName,
          }),
          get("live.TemplateBody"),
        ]),
        Details: pipe([
          ({ ConformancePackName }) => ({
            ConformancePackNames: [ConformancePackName],
          }),
          endpoint().describeConformancePackStatus,
          get("ConformancePackStatusDetails"),
          first,
        ]),
        // Rules: pipe([
        //   pickId,
        //   endpoint().describeConformancePackCompliance,
        //   get("ConformancePackRuleComplianceList"),
        // ]),
      }),
      ({ Details, ...other }) => ({ ...Details, ...other }),
      tap((params) => {
        assert(true);
      }),
      defaultsDeep(live),
    ])();

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
  dependencies: {
    stack: {
      type: "Stack",
      group: "CloudFormation",
      parent: true,
      dependsOnTypeOnly: true,
    },
    s3BucketDelivery: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) => pipe([get("DeliveryS3Bucket")]),
    },
    s3BucketTemplate: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) => pipe([get("TemplateS3Uri")]),
    },
    // TODO
    // deliveryChannel: {
    //   type: "DeliveryChannel",
    //   group: "Config",
    //   parent: true,
    //   dependencyId: ({ lives, config }) =>
    //     pipe([get("ConfigurationRecorderName")]),
    // },
  },
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
  getList: {
    method: "describeConformancePacks",
    getParam: "ConformancePackDetails",
    decorate,
  },
  create: {
    method: "putConformancePack",
    pickCreated: ({ payload }) => pipe([() => payload]),
    // TODO ConformancePackState: CREATE_COMPLETE
  },
  // TODO update

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
