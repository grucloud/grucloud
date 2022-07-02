const assert = require("assert");
const { pipe, map, tap, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const {
  NetworkManagerGlobalNetwork,
} = require("./NetworkManagerGlobalNetwork");
const { NetworkManagerCoreNetwork } = require("./NetworkManagerCoreNetwork");
const {
  NetworkManagerTransitGatewayRegistration,
} = require("./NetworkManagerTransitGatewayRegistration");

const GROUP = "NetworkManager";
const compareNetworkManager = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "GlobalNetwork",
      Client: NetworkManagerGlobalNetwork,
      compare: compareNetworkManager({
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
      }),
      filterLive: ({ resource, programOptions }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      omitProperties: [
        "GlobalNetworkId",
        "GlobalNetworkArn",
        "State",
        "CreatedAt",
      ],
    },
    {
      type: "CoreNetwork",
      Client: NetworkManagerCoreNetwork,
      compare: compareNetworkManager({
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
      }),
      filterLive: ({ resource, programOptions }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      omitProperties: [
        "GlobalNetworkId",
        "CoreNetworkId",
        "CoreNetworkArn",
        "CreatedAt",
        "State",
        "Segments",
        "Edges",
        "PolicyVersionId",
      ],
      dependencies: { globalNetwork: { type: "GlobalNetwork", group: GROUP } },
    },
    {
      type: "TransitGatewayRegistration",
      Client: NetworkManagerTransitGatewayRegistration,
      filterLive: ({ resource, programOptions }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      omitProperties: ["GlobalNetworkId", "TransitGatewayArn", "State"],
      inferName: pipe([
        get("dependenciesSpec"),
        ({ globalNetwork, transitGateway }) =>
          `tgw-assoc::${globalNetwork}::${transitGateway}`,
        tap((params) => {
          assert(true);
        }),
      ]),
      dependencies: {
        globalNetwork: { type: "GlobalNetwork", group: GROUP, parent: true },
        transitGateway: { type: "TransitGateway", group: "EC2" },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareNetworkManager({}),
    })
  ),
]);
