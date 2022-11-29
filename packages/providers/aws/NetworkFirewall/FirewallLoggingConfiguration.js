const assert = require("assert");
const { pipe, tap, get, pick, reduce, map } = require("rubico");
const { defaultsDeep, callProp, pluck } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const update =
  ({ endpoint }) =>
  ({
    payload: {
      LoggingConfiguration: { LogDestinationConfigs },
      FirewallArn,
    },
  }) =>
    pipe([
      tap(() => {
        assert(endpoint);
        assert(LogDestinationConfigs);
        assert(FirewallArn);
      }),
      () => LogDestinationConfigs,
      reduce(
        (acc, logDestinationConfig) =>
          pipe([
            () => [...acc, logDestinationConfig],
            (LogDestinationConfigsUpdated) =>
              pipe([
                () => ({
                  FirewallArn,
                  LoggingConfiguration: {
                    LogDestinationConfigs: LogDestinationConfigsUpdated,
                  },
                }),
                endpoint().updateLoggingConfiguration,
                () => LogDestinationConfigsUpdated,
              ])(),
          ])(),
        []
      ),
    ])();

const pickId = pipe([pick(["FirewallArn"])]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkLoggingConfiguration.html
exports.FirewallLoggingConfiguration = ({ compare }) => ({
  type: "LoggingConfiguration",
  package: "network-firewall",
  client: "NetworkFirewall",
  findName: () => get("FirewallName"),
  findId: () => pipe([get("FirewallArn")]),

  ignoreErrorCodes: ["ResourceNotFoundException"],
  inferName:
    ({ dependenciesSpec: { firewall } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(firewall);
        }),
        () => firewall,
      ])(),
  omitProperties: ["FirewallArn"],
  filterLive: ({ resource, programOptions }) =>
    pipe([
      assign({
        LoggingConfiguration: pipe([
          get("LoggingConfiguration"),
          assign({
            LogDestinationConfigs: pipe([
              get("LogDestinationConfigs"),
              map(
                pipe([
                  assign({
                    LogDestination: pipe([
                      get("LogDestination"),
                      // when(
                      //   get("logGroup"),
                      //   assign({
                      //     logGroup: pipe([
                      //       get("logGroup"),
                      //       tap((params) => {
                      //         assert(true);
                      //       }),
                      //     ]),
                      //   })
                      // ),
                    ]),
                  }),
                ])
              ),
            ]),
          }),
        ]),
      }),
    ]),
  dependencies: {
    firewall: {
      type: "Firewall",
      group: "NetworkFirewall",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("FirewallName"),
          lives.getByName({
            type: "Firewall",
            group: "NetworkFirewall",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    logGroups: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("LoggingConfiguration.LogDestinationConfigs"),
          pluck("LogDestination"),
          pluck("logGroup"),
          map(
            pipe([
              lives.getByName({
                type: "LogGroup",
                group: "CloudWatchLogs",
                providerName: config.providerName,
              }),
              get("id"),
            ])
          ),
        ]),
    },
    //TODO
    // buckets: {
    //   type: "Bucket",
    //   group: "S3",
    //   list: true,
    //   dependencyIds: ({ lives, config }) => get(""),
    // },
    //TODO firehose
  },
  getById: {
    method: "describeLoggingConfiguration",
    pickId,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      tap((params) => {
        assert(client);
        assert(endpoint);
        assert(getById);
        assert(config);
      }),
      () =>
        client.getListWithParent({
          parent: { type: "Firewall", group: "NetworkFirewall" },
          pickKey: pipe([pick(["FirewallArn"])]),
          method: "describeLoggingConfiguration",
          decorate: ({ lives, parent }) =>
            pipe([defaultsDeep(pick(["FirewallName", "FirewallArn"])(parent))]),
          config,
        }),
      tap((params) => {
        assert(true);
      }),
    ])(),
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { firewall },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(firewall);
      }),
      () => properties,
      defaultsDeep({
        FirewallArn: getField(firewall, "FirewallArn"),
      }),
    ])(),
  create: update,
  update,
  destroy:
    ({ endpoint }) =>
    ({
      live: {
        LoggingConfiguration: { LogDestinationConfigs },
        FirewallArn,
      },
    }) =>
      pipe([
        tap(() => {
          assert(endpoint);
          assert(LogDestinationConfigs);
        }),
        () => LogDestinationConfigs,
        reduce(
          (acc) =>
            pipe([
              () => acc,
              callProp("slice", 0, -1),
              (LogDestinationConfigsUpdated) =>
                pipe([
                  () => ({
                    FirewallArn,
                    LoggingConfiguration: {
                      LogDestinationConfigs: LogDestinationConfigsUpdated,
                    },
                  }),
                  endpoint().updateLoggingConfiguration,
                  () => LogDestinationConfigsUpdated,
                ])(),
            ])(),
          LogDestinationConfigs
        ),
      ])(),
});
