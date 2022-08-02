// Generated by 'gc gencode'
const { pipe, get, eq, and } = require("rubico");
const { find } = require("rubico/x");

exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "VPC",
    properties: ({}) => ({
      CidrBlock: "192.168.0.0/16",
      DnsHostnames: true,
    }),
  },
  { type: "InternetGateway", group: "EC2", name: "InternetGateway" },
  {
    type: "InternetGatewayAttachment",
    group: "EC2",
    dependencies: ({}) => ({
      vpc: "VPC",
      internetGateway: "InternetGateway",
    }),
  },
  {
    type: "NatGateway",
    group: "EC2",
    name: "NATGateway",
    dependencies: ({}) => ({
      subnet: "VPC::SubnetPublicUSEAST1F",
      eip: "NATIP",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "VPC::SubnetPrivateUSEAST1D",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}d`,
      Tags: [
        {
          Key: "kubernetes.io/role/internal-elb",
          Value: "1",
        },
      ],
      NewBits: 3,
      NetworkNumber: 3,
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "VPC::SubnetPrivateUSEAST1F",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}f`,
      Tags: [
        {
          Key: "kubernetes.io/role/internal-elb",
          Value: "1",
        },
      ],
      NewBits: 3,
      NetworkNumber: 2,
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "VPC::SubnetPublicUSEAST1D",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}d`,
      MapPublicIpOnLaunch: true,
      Tags: [
        {
          Key: "kubernetes.io/role/elb",
          Value: "1",
        },
      ],
      NewBits: 3,
      NetworkNumber: 1,
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: "VPC::SubnetPublicUSEAST1F",
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}f`,
      MapPublicIpOnLaunch: true,
      Tags: [
        {
          Key: "kubernetes.io/role/elb",
          Value: "1",
        },
      ],
      NewBits: 3,
      NetworkNumber: 0,
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "VPC::PrivateRouteTableUSEAST1D",
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "VPC::PrivateRouteTableUSEAST1F",
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: "VPC::PublicRouteTable",
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "VPC::PrivateRouteTableUSEAST1D",
      subnet: "VPC::SubnetPrivateUSEAST1D",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "VPC::PrivateRouteTableUSEAST1F",
      subnet: "VPC::SubnetPrivateUSEAST1F",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "VPC::PublicRouteTable",
      subnet: "VPC::SubnetPublicUSEAST1D",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({}) => ({
      routeTable: "VPC::PublicRouteTable",
      subnet: "VPC::SubnetPublicUSEAST1F",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "VPC::PrivateRouteTableUSEAST1D",
      natGateway: "NATGateway",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "VPC::PrivateRouteTableUSEAST1F",
      natGateway: "NATGateway",
    }),
  },
  {
    type: "Route",
    group: "EC2",
    properties: ({}) => ({
      DestinationCidrBlock: "0.0.0.0/0",
    }),
    dependencies: ({}) => ({
      routeTable: "VPC::PublicRouteTable",
      ig: "InternetGateway",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "ClusterSharedNodeSecurityGroup",
      Description: "Communication between all nodes in the cluster",
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "ControlPlaneSecurityGroup",
      Description:
        "Communication between the control plane and worker nodegroups",
    }),
    dependencies: ({}) => ({
      vpc: "VPC",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::VPC::eks-cluster-sg-my-cluster-1909614887",
    readOnly: true,
    filterLives: ({ resources }) =>
      pipe([
        () => resources,
        find(
          pipe([
            get("live.Tags"),
            find(
              and([
                eq(get("Key"), "aws:eks:cluster-name"),
                eq(get("Value"), "my-cluster"),
              ])
            ),
          ])
        ),
      ])(),
    dependencies: ({}) => ({
      vpc: "VPC",
      eksCluster: "my-cluster",
    }),
  },
  {
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      IpPermission: {
        IpProtocol: "-1",
      },
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::VPC::ClusterSharedNodeSecurityGroup",
      securityGroupFrom: ["sg::VPC::eks-cluster-sg-my-cluster-1909614887"],
    }),
  },
  { type: "ElasticIpAddress", group: "EC2", name: "NATIP" },
  {
    type: "LaunchTemplate",
    group: "EC2",
    name: "eksctl-my-cluster-nodegroup-ng-1",
    properties: ({}) => ({
      LaunchTemplateData: {
        BlockDeviceMappings: [
          {
            DeviceName: "/dev/xvda",
            Ebs: {
              Iops: 3000,
              VolumeSize: 80,
              VolumeType: "gp3",
              Throughput: 125,
            },
          },
        ],
        MetadataOptions: {
          HttpTokens: "optional",
          HttpPutResponseHopLimit: 2,
        },
      },
    }),
    dependencies: ({}) => ({
      securityGroups: ["sg::VPC::eks-cluster-sg-my-cluster-1909614887"],
    }),
  },
  {
    type: "Cluster",
    group: "EKS",
    properties: ({}) => ({
      name: "my-cluster",
      tags: {
        mykey1: "value",
      },
    }),
    dependencies: ({}) => ({
      subnets: [
        "VPC::SubnetPrivateUSEAST1D",
        "VPC::SubnetPrivateUSEAST1F",
        "VPC::SubnetPublicUSEAST1D",
        "VPC::SubnetPublicUSEAST1F",
      ],
      securityGroups: ["sg::VPC::ControlPlaneSecurityGroup"],
      role: "eksctl-my-cluster-cluster-ServiceRole-1T8YHA5ZIYVRB",
    }),
  },
  {
    type: "NodeGroup",
    group: "EKS",
    properties: ({}) => ({
      nodegroupName: "ng-1",
      capacityType: "ON_DEMAND",
      scalingConfig: {
        desiredSize: 1,
        maxSize: 1,
        minSize: 1,
      },
      labels: {
        "alpha.eksctl.io/cluster-name": "my-cluster",
        "alpha.eksctl.io/nodegroup-name": "ng-1",
      },
      tags: {
        mykey1: "value",
      },
    }),
    dependencies: ({}) => ({
      cluster: "my-cluster",
      subnets: ["VPC::SubnetPublicUSEAST1D", "VPC::SubnetPublicUSEAST1F"],
      role: "eksctl-my-cluster-nodegroup-ng-1-NodeInstanceRole-1LT5OVYUG2SEI",
      launchTemplate: "eksctl-my-cluster-nodegroup-ng-1",
    }),
  },
  {
    type: "OpenIDConnectProvider",
    group: "IAM",
    dependencies: ({}) => ({
      cluster: "my-cluster",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "eksctl-my-cluster-cluster-ServiceRole-1T8YHA5ZIYVRB",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `eks.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["cloudwatch:PutMetricData"],
                Resource: `*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "eksctl-my-cluster-cluster-PolicyCloudWatchMetrics",
        },
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "ec2:DescribeAccountAttributes",
                  "ec2:DescribeAddresses",
                  "ec2:DescribeInternetGateways",
                ],
                Resource: `*`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "eksctl-my-cluster-cluster-PolicyELBPermissions",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AmazonEKSClusterPolicy",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
        },
        {
          PolicyName: "AmazonEKSVPCResourceController",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
        },
      ],
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName:
        "eksctl-my-cluster-nodegroup-ng-1-NodeInstanceRole-1LT5OVYUG2SEI",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `ec2.amazonaws.com`,
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyName: "AmazonEKSWorkerNodePolicy",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
        },
        {
          PolicyName: "AmazonEC2ContainerRegistryReadOnly",
          PolicyArn:
            "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
        },
        {
          PolicyName: "AmazonSSMManagedInstanceCore",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
        },
        {
          PolicyName: "AmazonEKS_CNI_Policy",
          PolicyArn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
        },
      ],
    }),
  },
];
