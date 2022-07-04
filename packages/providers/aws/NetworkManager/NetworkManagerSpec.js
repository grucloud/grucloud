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
const { NetworkManagerSite } = require("./NetworkManagerSite");
const { NetworkManagerDevice } = require("./NetworkManagerDevice");
const { NetworkManagerLink } = require("./NetworkManagerLink");

const GROUP = "NetworkManager";
const compareNetworkManager = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "GlobalNetwork",
      Client: NetworkManagerGlobalNetwork,
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
      type: "Site",
      Client: NetworkManagerSite,
      omitProperties: [
        "GlobalNetworkId",
        "SiteId",
        "SiteArn",
        "CreatedAt",
        "State",
      ],
      dependencies: {
        globalNetwork: { type: "GlobalNetwork", group: GROUP, parent: true },
      },
    },
    {
      type: "Device",
      Client: NetworkManagerDevice,
      omitProperties: [
        "GlobalNetworkId",
        "SiteId",
        "DeviceId",
        "DeviceArn",
        "CreatedAt",
        "State",
      ],
      dependencies: {
        globalNetwork: { type: "GlobalNetwork", group: GROUP, parent: true },
        site: { type: "Site", group: GROUP, parent: true },
      },
    },
    {
      type: "Link",
      Client: NetworkManagerLink,
      omitProperties: [
        "GlobalNetworkId",
        "SiteId",
        "CreatedAt",
        "State",
        "LinkArn",
        "LinkId",
      ],
      dependencies: {
        globalNetwork: { type: "GlobalNetwork", group: GROUP, parent: true },
        site: { type: "Site", group: GROUP, parent: true },
      },
    },
    {
      type: "TransitGatewayRegistration",
      Client: NetworkManagerTransitGatewayRegistration,
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
