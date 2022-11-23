const assert = require("assert");
const { pipe, map, tap, get, eq } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

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
const {
  NetworkManagerVpcAttachment,
} = require("./NetworkManagerVpcAttachment");

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
      dependencies: {
        globalNetwork: {
          type: "GlobalNetwork",
          group: GROUP,
          dependencyId: ({ lives, config }) => get("GlobalNetworkId"),
        },
      },
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
        globalNetwork: {
          type: "GlobalNetwork",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("GlobalNetworkId"),
        },
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
        globalNetwork: {
          type: "GlobalNetwork",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("GlobalNetworkId"),
        },
        site: {
          type: "Site",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("SiteId"),
        },
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
        globalNetwork: {
          type: "GlobalNetwork",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("GlobalNetworkId"),
        },
        site: {
          type: "Site",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("SiteId"),
        },
      },
    },
    {
      type: "TransitGatewayRegistration",
      Client: NetworkManagerTransitGatewayRegistration,
      omitProperties: ["GlobalNetworkId", "TransitGatewayArn", "State"],
      inferName: ({ dependenciesSpec: { coreNetwork, vpc } }) =>
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
          group: GROUP,
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
                () =>
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
    },
    {
      type: "VpcAttachment",
      Client: NetworkManagerVpcAttachment,
      omitProperties: [
        "CoreNetworkId",
        "CoreNetworkArn",
        "AttachmentId",
        "State",
        "ResourceArn",
        "AttachmentPolicyRuleNumber",
      ],
      inferName: ({ dependenciesSpec: { coreNetwork, vpc } }) =>
        pipe([
          tap(() => {
            assert(coreNetwork);
            assert(vpc);
          }),
          () => `vpc-attach::::${coreNetwork}::${vpc}`,
        ]),
      dependencies: {
        coreNetwork: {
          type: "CoreNetwork",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              get("CoreNetworkId"),
              tap((CoreNetworkId) => {
                assert(CoreNetworkId);
              }),
            ]),
        },
        vpc: {
          type: "Vpc",
          group: "EC2",
          //TODO
          parent: true,
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                () =>
                  lives.getByType({
                    type: "Vpc",
                    group: "EC2",
                    providerName: config.providerName,
                  }),
                find(eq(get("live.VpcArn"), live.ResourceArn)),
                get("id"),
                tap((id) => {
                  assert(id);
                }),
              ])(),
        },
        subnets: {
          type: "Vpc",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("SubnetArns"),
              tap((SubnetArns) => {
                assert(SubnetArns);
              }),
            ]),
        },
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
