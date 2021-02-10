const { AwsProvider } = require("@grucloud/core");

const createResources = async ({ provider, resources: {} }) => {
  const clusterName = "cluster";

  const iamPolicyEKSCluster = await provider.useIamPolicyReadOnly({
    name: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
  });

  const roleCluster = await provider.makeIamRole({
    name: "role-cluster",
    dependencies: { policies: [iamPolicyEKSCluster] },
    properties: () => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "eks.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
  });

  const iamPolicyEKSWorkerNode = await provider.useIamPolicyReadOnly({
    name: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
  });

  const iamPolicyEC2ContainerRegistryReadOnly = await provider.useIamPolicyReadOnly(
    {
      name: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    }
  );
  const roleNodeGroup = await provider.makeIamRole({
    name: "role-node-group",
    dependencies: {
      policies: [iamPolicyEKSWorkerNode, iamPolicyEC2ContainerRegistryReadOnly],
    },
    properties: () => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
  });
  const vpc = await provider.makeVpc({
    name: "vpc-eks",
    properties: () => ({
      CidrBlock: "10.1.0.0/16",
      Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "shared" }],
    }),
  });

  const ig = await provider.makeInternetGateway({
    name: "ig-eks",
    dependencies: { vpc },
  });

  const subnetPublic = await provider.makeSubnet({
    name: "subnet-public",
    dependencies: { vpc },
    properties: () => ({
      CidrBlock: "10.1.0.1/24",
      AvailabilityZone: "eu-west-2a",
      Tags: [
        { Key: `kubernetes.io/cluster/${clusterName}`, Value: "shared" },
        { Key: "kubernetes.io/role/elb", Value: "1" },
      ],
    }),
  });

  const subnetPrivate = await provider.makeSubnet({
    name: "subnet-private",
    dependencies: { vpc },
    properties: () => ({
      CidrBlock: "10.1.1.1/24",
      AvailabilityZone: "eu-west-2b",
      Tags: [
        { Key: `kubernetes.io/cluster/${clusterName}`, Value: "shared" },
        { Key: "kubernetes.io/role/internal-elb", Value: "1" },
      ],
    }),
  });

  const routeTablePublic = await provider.makeRouteTables({
    name: "route-table-public",
    dependencies: { vpc, subnet: subnetPublic },
  });

  const routeIg = await provider.makeRoute({
    name: "route-ig-eks",
    dependencies: { routeTable: routeTablePublic, ig },
  });

  const eip = await provider.makeElasticIpAddress({
    name: "ip-eks",
  });

  const natGateway = await provider.makeNatGateway({
    name: "nat-gateway-eks",
    dependencies: { subnet: subnetPublic, eip },
  });

  const routeTablePrivate = await provider.makeRouteTables({
    name: "route-table-private",
    dependencies: { vpc, subnet: subnetPrivate },
  });

  const routeNat = await provider.makeRoute({
    name: "route-nat",
    dependencies: { routeTable: routeTablePrivate, natGateway },
  });

  const sg = await provider.makeSecurityGroup({
    name: "security-group-public-eks",
    dependencies: { vpc, subnet: subnetPublic },
    properties: () => ({
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      create: {
        Description: "SG for public subnet",
      },
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
      ingress: {
        IpPermissions: [
          {
            FromPort: 22,
            IpProtocol: "tcp",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
            Ipv6Ranges: [
              {
                CidrIpv6: "::/0",
              },
            ],
            ToPort: 22,
          },
          {
            FromPort: -1,
            IpProtocol: "icmp",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
            Ipv6Ranges: [
              {
                CidrIpv6: "::/0",
              },
            ],
            ToPort: -1,
          },
        ],
      },
    }),
  });

  const cluster = await provider.makeEKSCluster({
    name: clusterName,
    dependencies: {
      subnets: [subnetPublic, subnetPrivate],
      securityGroups: [sg],
      role: roleCluster,
    },
  });

  const nodeGroup = await provider.makeEKSNodeGroup({
    name: "node-group",
    dependencies: {
      subnets: [subnetPrivate],
      cluster,
      role: roleNodeGroup,
    },
  });

  return {
    roleCluster,
    roleNodeGroup,
    vpc,
    ig,
    subnetPrivate,
    routeTablePrivate,
    routeIg,
    routeTablePublic,
    routeNat,
    sg,
    cluster,
    nodeGroup,
  };
};

exports.createResources = createResources;

exports.createStack = async ({ name = "aws", config }) => {
  const provider = AwsProvider({ name, config });
  const resources = await createResources({ provider, resources: {} });
  return { provider, resources };
};
