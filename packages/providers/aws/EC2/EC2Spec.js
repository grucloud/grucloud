const assert = require("assert");
const { pipe, get, assign, map, omit, tap, pick, fork } = require("rubico");
const { pluck, defaultsDeep, when, flatten } = require("rubico/x");
const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");
const { isOurMinion } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { EC2Instance } = require("./EC2Instance");
const { compareEC2 } = require("./EC2Common");

const { EC2ClientVpnEndpoint } = require("./EC2ClientVpnEndpoint");
const { EC2ClientVpnTargetNetwork } = require("./EC2ClientVpnTargetNetwork");
const {
  EC2ClientVpnAuthorizationRule,
} = require("./EC2ClientVpnAuthorizationRule");
const { EC2CoipPool } = require("./EC2CoipPool");
const { EC2CustomerGateway } = require("./EC2CustomerGateway");
const { EC2DhcpOptions } = require("./EC2DhcpOptions");
const { EC2DhcpOptionsAssociation } = require("./EC2DhcpOptionsAssociation");
const {
  EC2EgressOnlyInternetGateway,
} = require("./EC2EgressOnlyInternetGateway");
const { EC2KeyPair } = require("./EC2KeyPair");
const { EC2InternetGateway } = require("./EC2InternetGateway");
const {
  EC2InternetGatewayAttachment,
} = require("./EC2InternetGatewayAttachment");

const { EC2LaunchTemplate } = require("./EC2LaunchTemplate");
//const { EC2LocalGatewayRoute } = require("./EC2LocalGatewayRoute");

const { EC2LocalGatewayRouteTable } = require("./EC2LocalGatewayRouteTable");
const { EC2NatGateway } = require("./EC2NatGateway");
const { EC2Ipam } = require("./EC2Ipam");
const { EC2IpamScope } = require("./EC2IpamScope");
const { EC2IpamPool } = require("./EC2IpamPool");
const { EC2IpamPoolCidr } = require("./EC2IpamPoolCidr");
const { EC2IpamResourceDiscovery } = require("./EC2IpamResourceDiscovery");
const {
  EC2IpamResourceDiscoveryAssociation,
} = require("./EC2IpamResourceDiscoveryAssociation");

const { EC2RouteTable } = require("./EC2RouteTable");
const { EC2RouteTableAssociation } = require("./EC2RouteTableAssociation");
const { EC2Route } = require("./EC2Route");
const { EC2Subnet } = require("./EC2Subnet");
const { EC2SecurityGroup } = require("./EC2SecurityGroup");
const {
  EC2SecurityGroupRuleIngress,
  EC2SecurityGroupRuleEgress,
} = require("./EC2SecurityGroupRule");
const { EC2ElasticIpAddress } = require("./EC2ElasticIpAddress");
const {
  EC2ElasticIpAddressAssociation,
} = require("./EC2ElasticIpAddressAssociation");
const { EC2FlowLogs } = require("./EC2FlowLogs");

const { EC2ManagedPrefixList } = require("./EC2ManagedPrefixList");
const { EC2NetworkInterface } = require("./EC2NetworkInterface");
const { EC2NetworkAcl } = require("./EC2NetworkAcl");
const {
  EC2VpcIpv4CidrBlockAssociation,
} = require("./EC2VpcIpv4CidrBlockAssociation");
const { EC2VpcPeeringConnection } = require("./EC2VpcPeeringConnection");
const { EC2PlacementGroup } = require("./EC2PlacementGroup");
const {
  EC2VpcPeeringConnectionAccepter,
} = require("./EC2VpcPeeringConnectionAccepter");
const { EC2TransitGateway } = require("./EC2TransitGateway");
const {
  EC2TransitGatewayAttachment,
} = require("./EC2TransitGatewayAttachment");
const {
  EC2TransitGatewayVpcAttachment,
} = require("./EC2TransitGatewayVpcAttachment");
const {
  EC2TransitGatewayPeeringAttachment,
} = require("./EC2TransitGatewayPeeringAttachment");
const { EC2TransitGatewayRoute } = require("./EC2TransitGatewayRoute");
const {
  EC2TransitGatewayRouteTable,
} = require("./EC2TransitGatewayRouteTable");
const {
  EC2TransitGatewayRouteTableAssociation,
} = require("./EC2TransitGatewayRouteTableAssociation");
const {
  EC2TransitGatewayRouteTablePropagation,
} = require("./EC2TransitGatewayRouteTablePropagation");
const { EC2Volume } = require("./EC2Volume");
const { EC2VolumeAttachment } = require("./EC2VolumeAttachment");
const { EC2Vpc } = require("./EC2Vpc");
const { EC2VpcEndpoint } = require("./EC2VpcEndpoint");
const { EC2VpnGateway } = require("./EC2VpnGateway");
const { EC2VpnGatewayAttachment } = require("./EC2VpnGatewayAttachment");
const {
  EC2VpnGatewayRoutePropagation,
} = require("./EC2VpnGatewayRoutePropagation");
const { EC2VpnConnection } = require("./EC2VpnConnection");
const { EC2VpnConnectionRoute } = require("./EC2VpnConnectionRoute");

const GROUP = "EC2";

module.exports = pipe([
  () => [
    createAwsService(EC2ClientVpnAuthorizationRule({ compare: compareEC2 })),
    createAwsService(EC2ClientVpnEndpoint({ compare: compareEC2 })),
    createAwsService(EC2ClientVpnTargetNetwork({ compare: compareEC2 })),
    createAwsService(EC2CoipPool({ compare: compareEC2 })),
    createAwsService(EC2CustomerGateway({ compare: compareEC2 })),
    createAwsService(EC2DhcpOptions({ compare: compareEC2 })),
    createAwsService(EC2DhcpOptionsAssociation({ compare: compareEC2 })),
    createAwsService(EC2FlowLogs({ compare: compareEC2 })),
    createAwsService(EC2Ipam({ compare: compareEC2 })),
    createAwsService(EC2IpamScope({ compare: compareEC2 })),
    createAwsService(EC2IpamPool({ compare: compareEC2 })),
    createAwsService(EC2IpamPoolCidr({ compare: compareEC2 })),
    createAwsService(EC2IpamResourceDiscovery({ compare: compareEC2 })),
    createAwsService(
      EC2IpamResourceDiscoveryAssociation({ compare: compareEC2 })
    ),
    createAwsService(EC2KeyPair({ compare: compareEC2 })),
    //createAwsService(EC2LocalGatewayRoute({ compare: compareEC2 })),
    createAwsService(EC2LocalGatewayRouteTable({ compare: compareEC2 })),
    createAwsService(EC2NetworkInterface({ compare: compareEC2 })),
    createAwsService(EC2Volume({ compare: compareEC2 })),
    createAwsService(EC2VolumeAttachment({ compare: compareEC2 })),
    createAwsService(EC2Vpc({ compare: compareEC2 })),
    createAwsService(EC2InternetGateway({ compare: compareEC2 })),
    createAwsService(EC2InternetGatewayAttachment({})),
    createAwsService(EC2EgressOnlyInternetGateway({})),
    createAwsService(EC2NatGateway({})),
    createAwsService(EC2Subnet({ compare: compareEC2 })),
    createAwsService(EC2RouteTable({ compare: compareEC2 })),
    createAwsService(EC2RouteTableAssociation({ compare: compareEC2 })),
    createAwsService(EC2Route({ compare: compareEC2 })),
    createAwsService(EC2SecurityGroup({ compare: compareEC2 })),
    createAwsService(EC2SecurityGroupRuleIngress({ compare: compareEC2 })),
    createAwsService(EC2SecurityGroupRuleEgress({ compare: compareEC2 })),
    createAwsService(EC2ElasticIpAddress({ compare: compareEC2 })),
    createAwsService(EC2ElasticIpAddressAssociation({ compare: compareEC2 })),
    createAwsService(EC2Instance({ compare: compareEC2 })),
    {
      type: "LaunchTemplate",
      Client: EC2LaunchTemplate,
      compare: compareEC2({
        filterTarget: () => pipe([omit(["LaunchTemplateData"])]),
        filterLive: () =>
          pipe([
            omit([
              "LaunchTemplateId",
              "VersionNumber",
              "CreateTime",
              "CreatedBy",
              "DefaultVersion",
              "DefaultVersionNumber",
              "LatestVersionNumber",
              "LaunchTemplateData", //TODO
            ]),
          ]),
      }),
      propertiesDefault: {
        LaunchTemplateData: { EbsOptimized: false },
      },
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          pick(["LaunchTemplateData"]),
          assign({
            LaunchTemplateData: pipe([
              get("LaunchTemplateData"),
              omitIfEmpty([
                "BlockDeviceMappings",
                "ElasticGpuSpecifications",
                "ElasticInferenceAccelerators",
                "SecurityGroups",
                "LicenseSpecifications",
                "TagSpecifications",
              ]),
              omit([
                "SecurityGroupIds",
                "ImageId",
                "IamInstanceProfile",
                "KeyName",
              ]),
              when(
                get("NetworkInterfaces"),
                assign({
                  NetworkInterfaces: pipe([
                    get("NetworkInterfaces"),
                    map(
                      pipe([
                        assign({
                          Groups: pipe([
                            get("Groups"),
                            map(
                              pipe([
                                replaceWithName({
                                  groupType: "EC2::SecurityGroup",
                                  path: "id",
                                  providerConfig,
                                  lives,
                                }),
                              ])
                            ),
                          ]),
                          SubnetId: pipe([
                            get("SubnetId"),
                            replaceWithName({
                              groupType: "EC2::Subnet",
                              path: "id",
                              providerConfig,
                              lives,
                            }),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                })
              ),
            ]),
          }),
        ]),
      dependencies: {
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("LaunchTemplateData.NetworkInterfaces", []),
              pluck("SubnetId"),
            ]),
        },
        keyPair: {
          type: "KeyPair",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("LaunchTemplateData.KeyName"),
              lives.getByName({
                type: "KeyPair",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("id"),
            ]),
        },
        iamInstanceProfile: {
          type: "InstanceProfile",
          group: "IAM",
          dependencyIds:
            ({ lives, config }) =>
            (live) =>
              [
                pipe([
                  () => live,
                  get("LaunchTemplateData.IamInstanceProfile.Arn"),
                ])(),
                pipe([
                  () => live,
                  get("LaunchTemplateData.IamInstanceProfile.Name"),
                  lives.getByName({
                    type: "InstanceProfile",
                    group: "IAM",
                    providerName: config.providerName,
                  }),
                  get("id"),
                ])(),
              ],
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              fork({
                fromMain: get("LaunchTemplateData.SecurityGroupIds"),
                fromInterfaces: pipe([
                  get("LaunchTemplateData.NetworkInterfaces"),
                  pluck("Groups"),
                  flatten,
                ]),
              }),
              ({ fromMain = [], fromInterfaces = [] }) => [
                ...fromMain,
                ...fromInterfaces,
              ],
            ]),
        },
        placementGroup: {
          type: "PlacementGroup",
          group: "EC2",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("LaunchTemplateData.Placement.GroupName"),
              lives.getByName({
                type: "PlacementGroup",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("id"),
            ]),
        },
      },
    },
    {
      type: "NetworkAcl",
      Client: EC2NetworkAcl,
      listOnly: true,
      ignoreResource: () => pipe([() => true]),
      dependencies: {
        vpc: { type: "Vpc", group: "EC2", dependencyId: () => get("VpcId") },
        subnets: {
          type: "Subnet",
          group: "EC2",
          excludeDefaultDependencies: true,
          dependencyIds: () => pipe([get("Associations"), pluck("SubnetId")]),
        },
      },
    },
    createAwsService(EC2ManagedPrefixList({ compare: compareEC2 })),
    createAwsService(EC2PlacementGroup({ compare: compareEC2 })),
    createAwsService(EC2VpcEndpoint({ compare: compareEC2 })),
    createAwsService(EC2VpcIpv4CidrBlockAssociation({ compare: compareEC2 })),
    createAwsService(EC2VpcPeeringConnection({ compare: compareEC2 })),
    createAwsService(EC2VpcPeeringConnectionAccepter({ compare: compareEC2 })),
    createAwsService(EC2TransitGateway({ compare: compareEC2 })),
    createAwsService(EC2TransitGatewayRoute({ compare: compareEC2 })),
    createAwsService(EC2TransitGatewayRouteTable({ compare: compareEC2 })),
    createAwsService(
      EC2TransitGatewayPeeringAttachment({ compare: compareEC2 })
    ),
    createAwsService(EC2TransitGatewayAttachment({ compare: compareEC2 })),
    createAwsService(EC2TransitGatewayVpcAttachment({ compare: compareEC2 })),
    createAwsService(
      EC2TransitGatewayRouteTableAssociation({ compare: compareEC2 })
    ),
    createAwsService(
      EC2TransitGatewayRouteTablePropagation({ compare: compareEC2 })
    ),
    createAwsService(EC2VpnGateway({ compare: compareEC2 })),
    createAwsService(EC2VpnGatewayAttachment({ compare: compareEC2 })),
    createAwsService(EC2VpnGatewayRoutePropagation({ compare: compareEC2 })),
    createAwsService(EC2VpnConnection({ compare: compareEC2 })),
    createAwsService(EC2VpnConnectionRoute({ compare: compareEC2 })),
  ],
  map(defaultsDeep({ group: GROUP, compare: compareEC2({}), isOurMinion })),
]);
