const assert = require("assert");
const { pipe, tap, get, pick, eq, fork } = require("rubico");
const { find } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "CoreNetwork" });
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = () =>
  pipe([
    ({ TransitGatewayArn, GlobalNetworkId }) =>
      `${TransitGatewayArn}::${GlobalNetworkId}`,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerTransitGatewayRegistration = () => ({
  type: "TransitGatewayRegistration",
  package: "networkmanager",
  client: "NetworkManager",
  ignoreErrorCodes: ["ValidationException"],
  ignoreErrorMessages: ["Incorrect input"],
  omitProperties: ["GlobalNetworkId", "TransitGatewayArn", "State"],
  inferName: ({ dependenciesSpec: { globalNetwork, transitGateway } }) =>
    pipe([
      tap(() => {
        assert(globalNetwork);
        assert(transitGateway);
      }),
      () => `tgw-assoc::${globalNetwork}::${transitGateway}`,
    ]),
  dependencies: {
    globalNetwork: {
      type: "GlobalNetwork",
      group: "NetworkManager",
      parent: true,
      dependencyId: ({ lives, config }) => get("GlobalNetworkId"),
    },
    transitGateway: {
      type: "TransitGateway",
      group: "EC2",
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            lives.getByType({
              type: "TransitGateway",
              group: "EC2",
              providerName: config.providerName,
            }),
            find(eq(get("live.TransitGatewayArn"), live.TransitGatewayArn)),
            get("id"),
          ])(),
    },
  },
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          globalNetworkName: pipe([
            get("GlobalNetworkId"),
            lives.getById({
              type: "GlobalNetwork",
              group: "NetworkManager",
              providerName: config.providerName,
            }),
            get("name", live.GlobalNetworkId),
          ]),
          transitGatewayName: pipe([
            lives.getByType({
              type: "TransitGateway",
              group: "EC2",
              providerName: config.providerName,
            }),
            find(eq(get("live.TransitGatewayArn"), live.TransitGatewayArn)),
            get("name", live.TransitGatewayArn),
          ]),
        }),
        ({ globalNetworkName, transitGatewayName }) =>
          `tgw-assoc::${globalNetworkName}::${transitGatewayName}`,
      ])(),
  findId,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#getTransitGatewayRegistrations-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "GlobalNetwork", group: "NetworkManager" },
          pickKey: pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["GlobalNetworkId"]),
          ]),
          method: "getTransitGatewayRegistrations",
          getParam: "TransitGatewayRegistrations",
          config,
        }),
    ])(),
  getByName: getByNameCore,
  getById: {
    method: "getTransitGatewayRegistrations",
    pickId: pipe([
      ({ GlobalNetworkId, TransitGatewayArn }) => ({
        GlobalNetworkId,
        TransitGatewayArns: [TransitGatewayArn],
      }),
    ]),
    getField: "TransitGatewayRegistrations",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#registerTransitGateway-property
  create: {
    method: "registerTransitGateway",
    pickCreated: ({ payload }) => pipe([get("TransitGatewayRegistration")]),
    isInstanceUp: pipe([
      tap(({ State }) => {
        logger.info(`registerTransitGateway State: ${State}`);
      }),
      eq(get("State.Code"), "AVAILABLE"),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#deregisterTransitGateway-property
  destroy: {
    method: "deregisterTransitGateway",
    pickId: pipe([pick(["TransitGatewayArn", "GlobalNetworkId"])]),
  },
  configDefault: ({ dependencies: { globalNetwork, transitGateway } }) =>
    pipe([
      tap((params) => {
        assert(globalNetwork);
        assert(transitGateway);
      }),
      () => ({
        GlobalNetworkId: getField(globalNetwork, "GlobalNetworkId"),
        TransitGatewayArn: getField(transitGateway, "TransitGatewayArn"),
      }),
    ])(),
});
