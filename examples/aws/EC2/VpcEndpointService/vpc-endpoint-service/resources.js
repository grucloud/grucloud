// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "InternetGateway", group: "EC2", name: "my-vpc-igw" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "my-vpc-vpc",
      internetGateway: "my-vpc-igw",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      ig: "my-vpc-igw",
      routeTable: "my-vpc-vpc::my-vpc-rtb-public",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "my-vpc-rtb-public",
    dependencies: ({}) => ({
      vpc: "my-vpc-vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: "my-vpc-vpc::my-vpc-rtb-public",
      subnet: `my-vpc-vpc::my-vpc-subnet-public1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: "my-vpc-vpc::my-vpc-rtb-public",
      subnet: `my-vpc-vpc::my-vpc-subnet-public2-${config.region}b`,
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `my-vpc-subnet-public1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "my-vpc-vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `my-vpc-subnet-public2-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 4,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "my-vpc-vpc",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "my-vpc-vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "VpcEndpointService",
    group: "EC2",
    name: "my-vpc-endpoint-service",
    properties: ({}) => ({
      AcceptanceRequired: true,
      SupportedIpAddressTypes: ["ipv4"],
    }),
    dependencies: ({}) => ({
      networkLoadBalancers: ["nlb"],
    }),
  },
  {
    type: "Listener",
    group: "ElasticLoadBalancingV2",
    properties: ({ getId }) => ({
      DefaultActions: [
        {
          ForwardConfig: {
            TargetGroups: [
              {
                TargetGroupArn: `${getId({
                  type: "TargetGroup",
                  group: "ElasticLoadBalancingV2",
                  name: "tg",
                })}`,
              },
            ],
          },
          Order: 1,
          TargetGroupArn: `${getId({
            type: "TargetGroup",
            group: "ElasticLoadBalancingV2",
            name: "tg",
          })}`,
          Type: "forward",
        },
      ],
      Port: 80,
      Protocol: "TCP",
    }),
    dependencies: ({}) => ({
      loadBalancer: "nlb",
      targetGroups: ["tg"],
    }),
  },
  {
    type: "LoadBalancer",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "nlb",
      Scheme: "internet-facing",
      Type: "network",
      IpAddressType: "ipv4",
    }),
    dependencies: ({ config }) => ({
      subnets: [
        `my-vpc-vpc::my-vpc-subnet-public1-${config.region}a`,
        `my-vpc-vpc::my-vpc-subnet-public2-${config.region}b`,
      ],
    }),
  },
  {
    type: "TargetGroup",
    group: "ElasticLoadBalancingV2",
    properties: ({}) => ({
      Name: "tg",
      Protocol: "TCP",
      Port: 80,
      HealthCheckProtocol: "HTTP",
      HealthCheckPort: "traffic-port",
      HealthCheckTimeoutSeconds: 6,
      Matcher: {
        HttpCode: "200-399",
      },
      TargetType: "alb",
    }),
    dependencies: ({}) => ({
      vpc: "my-vpc-vpc",
    }),
  },
];
