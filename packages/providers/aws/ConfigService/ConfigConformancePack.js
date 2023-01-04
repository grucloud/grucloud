const assert = require("assert");
const { pipe, tap, get, pick, fork, assign } = require("rubico");
const { defaultsDeep, when, first } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");

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

const model = ({ config }) => ({
  package: "config-service",
  client: "ConfigService",
  ignoreErrorCodes: ["NoSuchConformancePackException"],
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
});

exports.ConfigConformancePack = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: () => pipe([get("ConformancePackName")]),
    findId: () => pipe([get("ConformancePackName")]),
    getByName: getByNameCore,
    configDefault: ({
      name,
      namespace,
      properties: { ...otherProps },
      dependencies: { s3BucketDelivery, s3BucketTemplate },
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
