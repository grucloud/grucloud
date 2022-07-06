const assert = require("assert");
const { pipe, tap, get, pick, eq, fork } = require("rubico");
const { find } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "CoreNetwork" });
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");

const createModel = ({ config }) => ({
  package: "networkmanager",
  client: "NetworkManager",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: {
    method: "getTransitGatewayRegistrations",
    pickId: pipe([
      tap(({ GlobalNetworkId, TransitGatewayArn }) => {
        assert(GlobalNetworkId);
        assert(TransitGatewayArn);
      }),
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
});

const findId = pipe([
  get("live"),
  ({ TransitGatewayArn, GlobalNetworkId }) =>
    `${TransitGatewayArn}::${GlobalNetworkId}`,
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html
exports.NetworkManagerTransitGatewayRegistration = ({ spec, config }) =>
  createAwsResource({
    model: createModel({ config }),
    spec,
    config,
    findName: ({ live, lives }) =>
      pipe([
        fork({
          globalNetworkName: pipe([
            () =>
              lives.getById({
                id: live.GlobalNetworkId,
                type: "GlobalNetwork",
                group: "NetworkManager",
                providerName: config.providerName,
              }),
            get("name", live.GlobalNetworkId),
          ]),
          transitGatewayName: pipe([
            () =>
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
    findDependencies: ({ live, lives }) => [
      {
        type: "GlobalNetwork",
        group: "NetworkManager",
        ids: [live.GlobalNetworkId],
      },
      {
        type: "TransitGateway",
        group: "EC2",
        ids: [
          pipe([
            () =>
              lives.getByType({
                type: "TransitGateway",
                group: "EC2",
                providerName: config.providerName,
              }),
            find(eq(get("live.TransitGatewayArn"), live.TransitGatewayArn)),
            get("id"),
          ])(),
        ],
      },
    ],
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
