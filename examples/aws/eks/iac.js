const { AwsProvider } = require("@grucloud/core");

const createResources = async ({ provider, resources: {} }) => {
  const iamPolicyEKSCluster = await provider.useIamPolicyReadOnly({
    name: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
  });

  const role = await provider.makeIamRole({
    name: "eks",
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

  const vpc = await provider.makeVpc({
    name: "vpc-eks",
    properties: () => ({
      CidrBlock: "10.1.0.0/16",
    }),
  });
  const ig = await provider.makeInternetGateway({
    name: "ig-eks",
    dependencies: { vpc },
  });

  const subnetPublic = await provider.makeSubnet({
    name: "public",
    dependencies: { vpc },
    properties: () => ({
      CidrBlock: "10.1.0.1/24",
    }),
  });

  const subnetPrivate = await provider.makeSubnet({
    name: "private",
    dependencies: { vpc },
    properties: () => ({
      CidrBlock: "10.1.1.1/24",
      AvailabilityZone: "eu-west-2b",
    }),
  });

  const routeTablePublic = await provider.makeRouteTables({
    name: "route-table-public",
    dependencies: { vpc, ig },
    properties: () => ({}),
  });

  const eip = await provider.makeElasticIpAddress({
    name: "ip-eks",
  });

  const natGateway = await provider.makeNatGateway({
    name: "nat-gateway-eks",
    dependencies: { subnet: subnetPublic, eip },
    properties: () => ({}),
  });

  const routeTablePrivate = await provider.makeRouteTables({
    name: "route-table-private",
    dependencies: { vpc, natGateway },
    properties: () => ({}),
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
    name: "cluster",
    dependencies: {
      subnets: [subnetPublic, subnetPrivate],
      securityGroups: [sg],
      role,
    },
    properties: () => ({}),
  });

  return {
    role,
    vpc,
    ig,
    subnetPrivate,
    routeTablePrivate,
    routeTablePublic,
    sg,
    cluster,
  };
};

exports.createResources = createResources;

exports.createStack = async ({ name = "aws", config }) => {
  const provider = AwsProvider({ name, config });
  const resources = await createResources({ provider, resources: {} });
  return { provider, resources };
};
