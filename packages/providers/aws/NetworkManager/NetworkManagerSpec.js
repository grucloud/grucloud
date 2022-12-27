const assert = require("assert");
const { pipe, map, tap, get, eq, filter } = require("rubico");
const { defaultsDeep, find, when, isObject, isIn } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const {
  NetworkManagerGlobalNetwork,
} = require("./NetworkManagerGlobalNetwork");
const { NetworkManagerCoreNetwork } = require("./NetworkManagerCoreNetwork");
const {
  NetworkManagerTransitGatewayRegistration,
} = require("./NetworkManagerTransitGatewayRegistration");
const { NetworkManagerSite } = require("./NetworkManagerSite");
const {
  NetworkManagerSiteToSiteVpnAttachment,
} = require("./NetworkManagerSiteToSiteVpnAttachment");

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
    createAwsService(NetworkManagerSiteToSiteVpnAttachment({})),
    {
      type: "TransitGatewayRegistration",
      Client: NetworkManagerTransitGatewayRegistration,
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
        "CreatedAt",
        "UpdatedAt",
        "Arn",
        "SubnetArns",
        "VpcArn",
      ],
      inferName: ({ dependenciesSpec: { coreNetwork, vpc } }) =>
        pipe([
          tap(() => {
            assert(coreNetwork);
            assert(vpc);
          }),
          () => vpc,
          when(isObject, get("name")),
          (vpcName) => `vpc-attach::${coreNetwork}::${vpcName}`,
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
          parent: true,
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                tap((params) => {
                  assert(live.ResourceArn);
                }),
                lives.getByType({
                  type: "Vpc",
                  group: "EC2",
                }),
                tap((params) => {
                  assert(true);
                }),
                find(eq(get("live.VpcArn"), live.ResourceArn)),
                get("id"),
              ])(),
        },
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds:
            ({ lives, config }) =>
            ({ SubnetArns }) =>
              pipe([
                lives.getByType({
                  type: "Subnet",
                  group: "EC2",
                }),
                tap((params) => {
                  assert(SubnetArns);
                }),
                filter(pipe([get("live.Arn"), isIn(SubnetArns)])),
                map(get("id")),
              ])(),
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
