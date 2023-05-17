const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  map,
  flatMap,
  tryCatch,
  assign,
} = require("rubico");
const { defaultsDeep, filterOut, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { replaceAccountAndRegion } = require("../AwsCommon");

const pickId = pipe([
  tap(({ ResourceArn }) => {
    assert(ResourceArn);
  }),
  pick(["ResourceArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html
exports.WAFV2LoggingConfiguration = () => ({
  type: "LoggingConfiguration",
  package: "wafv2",
  client: "WAFV2",
  propertiesDefault: {},
  omitProperties: [],
  inferName:
    ({ dependenciesSpec: { webAcl } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(webAcl);
        }),
        () => `${webAcl}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ ResourceArn }) =>
      pipe([
        tap((params) => {
          assert(ResourceArn);
        }),
        () => ResourceArn,
        lives.getById({
          type: "WebACL",
          group: "WAFv2",
          providerName: config.providerName,
        }),
        get("name", ResourceArn),
      ])(),
  findId: () =>
    pipe([
      get("ResourceArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        LogDestinationConfigs: pipe([
          get("LogDestinationConfigs"),
          map(replaceAccountAndRegion({ lives, providerConfig })),
        ]),
      }),
    ]),
  ignoreErrorCodes: ["WAFNonexistentItemException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#getLoggingConfiguration-property
  getById: {
    method: "getLoggingConfiguration",
    //getField: "LoggingConfiguration",
    pickId,
    decorate,
  },
  dependencies: {
    webAcl: {
      type: "WebACL",
      group: "WAFv2",
      pathId: "ResourceArn",
      required: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ResourceArn"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    cloudWatchLogGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      list: true,
      pathId: "LogDestinationConfigs",
      dependencyIds: ({ lives, config }) =>
        pipe([get("LogDestinationConfigs")]),
    },
    firehoseDeliveryStream: {
      type: "DeliveryStream",
      group: "Firehose",
      list: true,
      pathId: "LogDestinationConfigs",
      dependencyIds: ({ lives, config }) =>
        pipe([get("LogDestinationConfigs")]),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      list: true,
      pathId: "LogDestinationConfigs",
      dependencyIds: ({ lives, config }) =>
        pipe([get("LogDestinationConfigs")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#listLoggingConfigurations-property
  getList: ({ endpoint, getById }) =>
    pipe([
      () => ["CLOUDFRONT", "REGIONAL"],
      flatMap((Scope) =>
        tryCatch(
          pipe([
            () => ({ Scope }),
            endpoint().listLoggingConfigurations,
            get("LoggingConfigurations"),
            map(pipe([getById({})])),
          ]),
          (error) =>
            pipe([
              tap((params) => {
                assert(error);
              }),
              () => undefined,
            ])()
        )()
      ),
      filterOut(isEmpty),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#createLoggingConfiguration-property
  create: {
    method: "createLoggingConfiguration",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#putLoggingConfiguration-property
  update: {
    method: "putLoggingConfiguration",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#deleteLoggingConfiguration-property
  destroy: {
    method: "deleteLoggingConfiguration",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { webACL },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(webACL);
      }),
      () => otherProps,
      defaultsDeep({ ResourceArn: getField(webACL, "ARN") }),
    ])(),
});
