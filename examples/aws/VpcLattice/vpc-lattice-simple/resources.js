// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "RouteTable",
    group: "EC2",
    name: "Private Route Table (Destination Subnet)",
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "Private Route Table (Source Subnet)",
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "VPC::Private Route Table (Destination Subnet)",
      subnet: "VPC::Private Subnet (Destination Subnet)",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "VPC::Private Route Table (Source Subnet)",
      subnet: "VPC::Private Subnet (Source Subnet)",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "demo-inboundsg",
      Description: "Security group for InboundLambdaFunction",
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "demo-outboundsg",
      Description: "Security group for OutboundLambdaFunction",
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "demo-servicenetworksg",
      Description: "Security group for service network access",
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 443,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "169.254.171.0/24",
        },
      ],
      ToPort: 443,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::VPC::demo-inboundsg",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 443,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "10.0.0.0/16",
        },
      ],
      ToPort: 443,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::VPC::demo-servicenetworksg",
    }),
  },
  {
    type: "SecurityGroupRuleEgress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 443,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "169.254.171.0/24",
        },
      ],
      ToPort: 443,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::VPC::demo-outboundsg",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "Private Subnet (Destination Subnet)",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 8,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "Private Subnet (Source Subnet)",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 8,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "VPC",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "vpclatticedemo-InboundLambdaFunctionRole-MOK9FMSJUYDM",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
          },
        ],
        Version: "2008-10-17",
      },
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents",
                  "xray:PutTraceSegments",
                  "xray:PutTelemetryRecords",
                  "ec2:CreateNetworkInterface",
                  "ec2:DescribeNetworkInterfaces",
                  "ec2:DeleteNetworkInterface",
                ],
                Effect: "Allow",
                Resource: "*",
              },
            ],
          },
          PolicyName: "root",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "vpclatticedemo-OutboundLambdaFunctionRole-4HOJL6ADS26",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
          },
        ],
        Version: "2008-10-17",
      },
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents",
                  "xray:PutTraceSegments",
                  "xray:PutTelemetryRecords",
                  "ec2:CreateNetworkInterface",
                  "ec2:DescribeNetworkInterfaces",
                  "ec2:DeleteNetworkInterface",
                ],
                Effect: "Allow",
                Resource: "*",
              },
            ],
          },
          PolicyName: "root",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "vpclatticedemo-InboundLambdaFunction-yfe1VEdAiTP6",
        Handler: "index.handler",
        Runtime: "python3.9",
        Timeout: 10,
        TracingConfig: {
          Mode: "Active",
        },
      },
    }),
    dependencies: ({}) => ({
      role: "vpclatticedemo-InboundLambdaFunctionRole-MOK9FMSJUYDM",
      subnets: ["VPC::Private Subnet (Destination Subnet)"],
      securityGroups: ["sg::VPC::demo-inboundsg"],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({ getId }) => ({
      Configuration: {
        Environment: {
          Variables: {
            ENDPOINT: `${getId({
              type: "Service",
              group: "VpcLattice",
              name: "demo-service",
              path: "live.dnsEntry.domainName",
            })}`,
          },
        },
        FunctionName: "vpclatticedemo-OutboundLambdaFunction-lNIKqW9bcE8F",
        Handler: "index.handler",
        Runtime: "python3.9",
        Timeout: 10,
        TracingConfig: {
          Mode: "Active",
        },
      },
    }),
    dependencies: ({}) => ({
      role: "vpclatticedemo-OutboundLambdaFunctionRole-4HOJL6ADS26",
      subnets: ["VPC::Private Subnet (Source Subnet)"],
      securityGroups: ["sg::VPC::demo-outboundsg"],
      vpcLatticeService: ["demo-service"],
    }),
  },
  {
    type: "Listener",
    group: "VpcLattice",
    properties: ({ getId }) => ({
      defaultAction: {
        forward: {
          targetGroups: [
            {
              targetGroupIdentifier: `${getId({
                type: "TargetGroup",
                group: "VpcLattice",
                name: "demo-targetgroup",
              })}`,
              weight: 100,
            },
          ],
        },
      },
      name: "demo-listener",
      port: 443,
      protocol: "HTTPS",
    }),
    dependencies: ({}) => ({
      service: "demo-service",
      targetGroups: ["demo-targetgroup"],
    }),
  },
  {
    type: "Service",
    group: "VpcLattice",
    properties: ({}) => ({
      authType: "NONE",
      name: "demo-service",
    }),
  },
  {
    type: "ServiceNetwork",
    group: "VpcLattice",
    properties: ({}) => ({
      authType: "NONE",
      name: "demo-servicenetwork",
    }),
  },
  {
    type: "ServiceNetworkServiceAssociation",
    group: "VpcLattice",
    dependencies: ({}) => ({
      service: "demo-service",
      serviceNetwork: "demo-servicenetwork",
    }),
  },
  {
    type: "ServiceNetworkVpcAssociation",
    group: "VpcLattice",
    dependencies: ({}) => ({
      vpc: "VPC",
      serviceNetwork: "demo-servicenetwork",
    }),
  },
  {
    type: "TargetGroup",
    group: "VpcLattice",
    properties: ({ getId }) => ({
      name: "demo-targetgroup",
      targets: [
        {
          id: `${getId({
            type: "Function",
            group: "Lambda",
            name: "vpclatticedemo-InboundLambdaFunction-yfe1VEdAiTP6",
          })}`,
        },
      ],
      type: "LAMBDA",
    }),
    dependencies: ({}) => ({
      lambdaFunctions: ["vpclatticedemo-InboundLambdaFunction-yfe1VEdAiTP6"],
    }),
  },
];
