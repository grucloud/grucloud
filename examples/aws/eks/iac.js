const { AwsProvider } = require("@grucloud/core");
const { get } = require("rubico");
const loadBalancerPolicy = require("./load-balancer-policy.json");
const podPolicy = require("./pod-policy.json");
const hooks = require("./hooks");

const createResources = async ({ provider, resources: {} }) => {
  const clusterName = "cluster";
  const iamOpenIdConnectProviderName = "oicp-eks";

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

  const iamPolicyEKS_CNI = await provider.useIamPolicyReadOnly({
    name: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
  });

  const roleNodeGroup = await provider.makeIamRole({
    name: "role-node-group",
    dependencies: {
      policies: [
        iamPolicyEKSWorkerNode,
        iamPolicyEC2ContainerRegistryReadOnly,
        iamPolicyEKS_CNI,
      ],
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
      DnsHostnames: true,
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

  const securityGroupCluster = await provider.makeSecurityGroup({
    name: "security-group-cluster",
    dependencies: { vpc },
    properties: () => ({
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      create: {
        Description: "SG for the EKS Cluster",
      },
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
      ingress: {
        IpPermissions: [
          {
            FromPort: 443,
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
            ToPort: 443,
          },
        ],
      },
      egress: {
        IpPermissions: [
          {
            FromPort: 1024,
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
            ToPort: 65535,
          },
        ],
      },
    }),
  });
  const securityGroupNodes = await provider.makeSecurityGroup({
    name: "security-group-nodes",
    dependencies: { vpc, securityGroup: securityGroupCluster },
    properties: ({ dependencies: { securityGroup } }) => ({
      Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "owned" }],
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      create: {
        Description: "SG for the EKS Nodes",
      },
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
      ingress: {
        IpPermissions: [
          {
            FromPort: 0,
            IpProtocol: "-1",
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
            ToPort: 65535,
          },
          {
            FromPort: 1025,
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
            UserIdGroupPairs: [{ GroupId: securityGroup.live?.GroupId }],
            ToPort: 65535,
          },
        ],
      },
    }),
  });

  const cluster = await provider.makeEKSCluster({
    name: clusterName,
    dependencies: {
      subnets: [subnetPublic, subnetPrivate],
      securityGroups: [securityGroupCluster, securityGroupNodes],
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

  const iamOpenIdConnectProvider = await provider.makeIamOpenIDConnectProvider({
    name: iamOpenIdConnectProviderName,
    dependencies: { cluster },
    properties: ({ dependencies: { cluster } }) => ({
      Url: get(
        "live.identity.oidc.issuer",
        "oidc.issuer not available yet"
      )(cluster),
      ClientIDList: ["sts.amazonaws.com"],
    }),
  });

  const iamPodPolicy = await provider.makeIamPolicy({
    name: "PodPolicy",
    properties: () => ({
      PolicyDocument: podPolicy,
      Description: "Pod Policy",
    }),
  });

  const rolePod = await provider.makeIamRole({
    name: "role-pod",
    dependencies: { policies: [iamPodPolicy] },
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

  const iamLoadBalancerPolicy = await provider.makeIamPolicy({
    name: "AWSLoadBalancerControllerIAMPolicy",
    properties: () => ({
      PolicyDocument: loadBalancerPolicy,
      Description: "Load Balancer Policy",
    }),
  });

  const roleLoadBalancer = await provider.makeIamRole({
    name: "role-load-balancer",
    dependencies: {
      iamOpenIdConnectProvider,
      policies: [iamLoadBalancerPolicy],
    },
    properties: ({ dependencies: { iamOpenIdConnectProvider } }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: get(
                "live.Arn",
                "iamOpenIdConnectProvider.Arn not yet known"
              )(iamOpenIdConnectProvider),
            },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                [`${get(
                  "live.Url",
                  "iamOpenIdConnectProvider.Url not yet known"
                )(iamOpenIdConnectProvider)}:aud`]: "sts.amazonaws.com",
              },
            },
          },
        ],
      },
    }),
  });

  return {
    roleCluster,
    roleNodeGroup,
    roleLoadBalancer,
    rolePod,
    vpc,
    ig,
    subnetPrivate,
    routeTablePrivate,
    routeIg,
    routeTablePublic,
    routeNat,
    securityGroupCluster,
    cluster,
    nodeGroup,
    iamOpenIdConnectProvider,
  };
};

exports.createResources = createResources;

exports.createStack = async ({ name = "aws", config }) => {
  const provider = AwsProvider({ name, config });
  const resources = await createResources({ provider, resources: {} });
  return {
    provider,
    resources,
    hooks,
    isProviderUp: () => resources.cluster.getLive(),
  };
};
