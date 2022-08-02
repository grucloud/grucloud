const assert = require("assert");
const { pipe, tap, get, pick, map, reduce } = require("rubico");
const { defaultsDeep, pluck, callProp } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const createModel = ({ config }) => ({
  package: "network-firewall",
  client: "NetworkFirewall",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: {
    method: "describeLoggingConfiguration",
  },
});

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
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkLoggingConfiguration.html
exports.FirewallLoggingConfiguration = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: get("live.FirewallName"),
    findId: pipe([get("live.FirewallArn")]),
    pickId: pipe([pick(["FirewallArn"])]),
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
              pipe([
                defaultsDeep(pick(["FirewallName", "FirewallArn"])(parent)),
              ]),
            config,
          }),
        tap((params) => {
          assert(true);
        }),
      ])(),
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getByName: getByNameCore,
    configDefault: ({
      name,
      namespace,
      properties,
      dependencies: { firewall },
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
