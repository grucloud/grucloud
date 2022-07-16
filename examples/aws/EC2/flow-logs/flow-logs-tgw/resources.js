// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "/aws/flowlog/tgw",
    properties: ({}) => ({
      retentionInDays: 1,
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    name: "/aws/flowlog/tgw-vpc-attachment",
    properties: ({}) => ({
      retentionInDays: 1,
    }),
  },
  {
    type: "FlowLogs",
    group: "EC2",
    name: "flow-logs-tgw-attach",
    properties: ({ config }) => ({
      DeliverLogsPermissionArn: `arn:aws:iam::${config.accountId()}:role/aws-service-role/events.amazonaws.com/AWSServiceRoleForCloudWatchEvents`,
      LogFormat:
        "${version} ${resource-type} ${account-id} ${tgw-id} ${tgw-attachment-id} ${tgw-src-vpc-account-id} ${tgw-dst-vpc-account-id} ${tgw-src-vpc-id} ${tgw-dst-vpc-id} ${tgw-src-subnet-id} ${tgw-dst-subnet-id} ${tgw-src-eni} ${tgw-dst-eni} ${tgw-src-az-id} ${tgw-dst-az-id} ${tgw-pair-attachment-id} ${srcaddr} ${dstaddr} ${srcport} ${dstport} ${protocol} ${packets} ${bytes} ${start} ${end} ${log-status} ${type} ${packets-lost-no-route} ${packets-lost-blackhole} ${packets-lost-mtu-exceeded} ${packets-lost-ttl-expired} ${tcp-flags} ${region} ${flow-direction} ${pkt-src-aws-service} ${pkt-dst-aws-service}",
      MaxAggregationInterval: 60,
    }),
    dependencies: ({}) => ({
      transitGatewayVpcAttachment: "tgw-vpc-attach::my-tgw::my-vpc",
      cloudWatchLogGroup: "/aws/flowlog/tgw-vpc-attachment",
    }),
  },
  {
    type: "FlowLogs",
    group: "EC2",
    name: "my-flow-log",
    properties: ({ config }) => ({
      DeliverLogsPermissionArn: `arn:aws:iam::${config.accountId()}:role/aws-service-role/events.amazonaws.com/AWSServiceRoleForCloudWatchEvents`,
      LogFormat:
        "${version} ${resource-type} ${account-id} ${tgw-id} ${tgw-attachment-id} ${tgw-src-vpc-account-id} ${tgw-dst-vpc-account-id} ${tgw-src-vpc-id} ${tgw-dst-vpc-id} ${tgw-src-subnet-id} ${tgw-dst-subnet-id} ${tgw-src-eni} ${tgw-dst-eni} ${tgw-src-az-id} ${tgw-dst-az-id} ${tgw-pair-attachment-id} ${srcaddr} ${dstaddr} ${srcport} ${dstport} ${protocol} ${packets} ${bytes} ${start} ${end} ${log-status} ${type} ${packets-lost-no-route} ${packets-lost-blackhole} ${packets-lost-mtu-exceeded} ${packets-lost-ttl-expired} ${tcp-flags} ${region} ${flow-direction} ${pkt-src-aws-service} ${pkt-dst-aws-service}",
      MaxAggregationInterval: 60,
    }),
    dependencies: ({}) => ({
      transitGateway: "my-tgw",
      cloudWatchLogGroup: "/aws/flowlog/tgw",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "my-vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/24",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "my-vpc::subnet-1",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 4,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "my-vpc",
    }),
  },
  {
    type: "TransitGateway",
    group: "EC2",
    name: "my-tgw",
    properties: ({}) => ({
      Description: "",
      Options: {
        AmazonSideAsn: 64512,
        AutoAcceptSharedAttachments: "disable",
        DefaultRouteTableAssociation: "enable",
        DefaultRouteTablePropagation: "enable",
        VpnEcmpSupport: "enable",
        DnsSupport: "enable",
        MulticastSupport: "disable",
      },
    }),
  },
  {
    type: "TransitGatewayRouteTable",
    group: "EC2",
    name: "tgw-rtb-my-tgw-default",
    readOnly: true,
    properties: ({}) => ({
      DefaultAssociationRouteTable: true,
      DefaultPropagationRouteTable: true,
    }),
    dependencies: ({}) => ({
      transitGateway: "my-tgw",
    }),
  },
  {
    type: "TransitGatewayVpcAttachment",
    group: "EC2",
    name: "tgw-vpc-attach::my-tgw::my-vpc",
    properties: ({}) => ({
      Options: {
        DnsSupport: "enable",
        Ipv6Support: "disable",
        ApplianceModeSupport: "disable",
      },
    }),
    dependencies: ({}) => ({
      transitGateway: "my-tgw",
      vpc: "my-vpc",
      subnets: ["my-vpc::subnet-1"],
    }),
  },
  {
    type: "TransitGatewayRouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      transitGatewayRouteTable: "tgw-rtb-my-tgw-default",
      transitGatewayVpcAttachment: "tgw-vpc-attach::my-tgw::my-vpc",
    }),
  },
  {
    type: "TransitGatewayRouteTablePropagation",
    group: "EC2",
    dependencies: ({}) => ({
      transitGatewayRouteTable: "tgw-rtb-my-tgw-default",
      transitGatewayVpcAttachment: "tgw-vpc-attach::my-tgw::my-vpc",
    }),
  },
];
