const assert = require("assert");
const { pipe, tap, get, pick, fork, assign } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      Arn: pipe([
        tap(({ Id }) => {
          assert(Id);
        }),
        ({ Id }) =>
          `arn:aws:route53:${
            config.region
          }:${config.accountId()}:queryloggingconfig/${Id}`,
      ]),
    }),
  ]);

const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  pick(["Id"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html
exports.Route53QueryLog = () => ({
  type: "QueryLog",
  package: "route-53",
  client: "Route53",
  propertiesDefault: {},
  omitProperties: ["Id", "Arn"],
  inferName:
    ({ dependenciesSpec: { cloudWatchLogGroup, hostedZone } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(hostedZone);
          assert(cloudWatchLogGroup);
        }),
        () => `${hostedZone}::${cloudWatchLogGroup}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          cloudWatchLogsLogGroup: pipe([
            get("CloudWatchLogsLogGroupArn"),
            tap((CloudWatchLogsLogGroupArn) => {
              assert(CloudWatchLogsLogGroupArn);
            }),
            callProp("replace", ":*", ""),
            lives.getById({
              type: "LogGroup",
              group: "CloudWatchLogs",
              providerName: config.providerName,
            }),
            get("name", live.CloudWatchLogsLogGroupArn),
          ]),
          hostedZone: pipe([
            get("HostedZoneId"),
            tap((HostedZoneId) => {
              assert(HostedZoneId);
            }),
            lives.getById({
              type: "HostedZone",
              group: "Route53",
              providerName: config.providerName,
            }),
            get("name", live.HostedZoneId),
          ]),
        }),
        tap(({ cloudWatchLogsLogGroup, hostedZone }) => {
          assert(cloudWatchLogsLogGroup);
          assert(hostedZone);
        }),
        ({ cloudWatchLogsLogGroup, hostedZone }) =>
          `${hostedZone}::${cloudWatchLogsLogGroup}`,
      ])(),
  findId:
    () =>
    ({ CloudWatchLogsLogGroupArn, HostedZoneId }) =>
      pipe([
        tap(() => {
          assert(CloudWatchLogsLogGroupArn);
          assert(HostedZoneId);
        }),
        () => `${HostedZoneId}::${CloudWatchLogsLogGroupArn}`,
      ])(),
  ignoreErrorCodes: ["NoSuchQueryLoggingConfig"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        CloudWatchLogsLogGroupArn: pipe([
          get("CloudWatchLogsLogGroupArn"),
          replaceAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  dependencies: {
    cloudWatchLogGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("CloudWatchLogsLogGroupArn"),
          callProp("replace", ":*", ""),
          tap((CloudWatchLogsLogGroupArn) => {
            assert(CloudWatchLogsLogGroupArn);
          }),
        ]),
    },
    hostedZone: {
      type: "HostedZone",
      group: "Route53",
      parent: true,
      pathId: "HostedZoneId",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("HostedZoneId"),
          tap((HostedZoneId) => {
            assert(HostedZoneId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getQueryLoggingConfig-property
  getById: {
    method: "getQueryLoggingConfig",
    getField: "QueryLoggingConfig",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listQueryLoggingConfigs-property
  getList: {
    method: "listQueryLoggingConfigs",
    getParam: "QueryLoggingConfigs",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createQueryLoggingConfig-property
  create: {
    method: "createQueryLoggingConfig",
    pickCreated: ({ payload }) => pipe([get("QueryLoggingConfig")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteQueryLoggingConfig-property
  destroy: {
    method: "deleteQueryLoggingConfig",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { cloudWatchLogGroup, hostedZone },
    config,
  }) =>
    pipe([
      tap(() => {
        // assert(cloudWatchLogGroup);
        assert(hostedZone);
      }),
      () => otherProps,
      defaultsDeep({
        //CloudWatchLogsLogGroupArn: getField(cloudWatchLogGroup, "arn"),
        HostedZoneId: getField(hostedZone, "HostedZoneId"),
      }),
    ])(),
});
