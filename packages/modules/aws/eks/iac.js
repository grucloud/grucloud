const assert = require("assert");
const { map, pipe, and, tap } = require("rubico");
const { pluck, identity } = require("rubico/x");

exports.config = require("./config");
exports.hooks = [require("./hook")];

const logger = require("@grucloud/core/logger")({ prefix: "EKSModule" });

const isProviderUp = ({ resources }) =>
  pipe([
    and([() => resources.cluster.getLive()]),
    tap((isUp) => {
      assert(true);
      logger.debug(`isProviderUp ${isUp}`);
    }),
  ])();

exports.isProviderUp = isProviderUp;

const NamespaceDefault = "EKS";

const createResources = async ({
  provider,
  resources,
  namespace = NamespaceDefault,
}) => {
  const { config } = provider;
  const formatName = config.formatName || identity;
  assert(config.eks);
  assert(config.eks.cluster);
  assert(config.eks.roleCluster);
  assert(config.eks.nodeGroupsPublic);
  assert(config.eks.nodeGroupsPrivate);

  assert(config.vpc);
  assert(resources);
  assert(resources.vpc);
  const { vpc, subnetsPublic, privates } = resources;
  assert(vpc);
  assert(subnetsPublic);
  const clusterName = config.eks.cluster.name;
  assert(clusterName);

  const iamPolicyEKSCluster = provider.iam.usePolicy({
    name: "AmazonEKSClusterPolicy",
    namespace,
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
    }),
  });

  const iamPolicyEKSVPCResourceController = provider.iam.usePolicy({
    name: "AmazonEKSVPCResourceController",
    namespace,
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
    }),
  });

  const roleCluster = provider.iam.makeRole({
    name: formatName(config.eks.roleCluster.name, config),
    namespace,
    dependencies: {
      policies: [iamPolicyEKSCluster, iamPolicyEKSVPCResourceController],
    },
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

  const iamPolicyEKSWorkerNode = provider.iam.usePolicy({
    name: "AmazonEKSWorkerNodePolicy",
    namespace,
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    }),
  });

  const iamPolicyEC2ContainerRegistryReadOnly = provider.iam.usePolicy({
    name: "AmazonEC2ContainerRegistryReadOnly",
    namespace,
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    }),
  });

  const iamPolicyEKS_CNI = provider.iam.usePolicy({
    name: "AmazonEKS_CNI_Policy",
    namespace,
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    }),
  });

  const roleNodeGroup = provider.iam.makeRole({
    name: formatName(config.eks.roleNodeGroup.name, config),
    namespace,
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

  const securityGroupCluster = provider.ec2.makeSecurityGroup({
    name: formatName(config.eks.securityGroupCluster.name, config),
    namespace,
    dependencies: { vpc },
    properties: () => ({
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      create: {
        Description: "EKS Cluster Security Group",
      },
    }),
  });

  const sgClusterRuleIngressHttps = provider.ec2.makeSecurityGroupRuleIngress({
    name: formatName("sg-cluster-rule-ingress-https", config),
    namespace,
    dependencies: {
      securityGroup: securityGroupCluster,
    },
    properties: () => ({
      IpPermission: {
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
    }),
  });
  const sgClusterRuleEgress = provider.ec2.makeSecurityGroupRuleEgress({
    name: formatName("sg-cluster-rule-egress", config),
    namespace,
    dependencies: {
      securityGroup: securityGroupCluster,
    },
    properties: () => ({
      IpPermission: {
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
    }),
  });

  const securityGroupNodes = provider.ec2.makeSecurityGroup({
    name: formatName(config.eks.securityGroupNode.name, config),
    namespace,
    dependencies: { vpc },
    properties: () => ({
      Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "owned" }],
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      create: {
        Description: "SG for the EKS Nodes",
      },
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
    }),
  });

  const sgNodesRuleIngressAll = provider.ec2.makeSecurityGroupRuleIngress({
    name: formatName("sg-nodes-rule-ingress-all", config),
    namespace,
    dependencies: {
      securityGroup: securityGroupNodes,
    },
    properties: () => ({
      IpPermission: {
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
      },
    }),
  });
  const sgNodesRuleIngressCluster = provider.ec2.makeSecurityGroupRuleIngress({
    name: formatName("sg-rule-node-group-ingress-cluster", config),
    namespace,
    dependencies: {
      securityGroup: securityGroupNodes,
      securityGroupCluster,
    },
    properties: ({ dependencies: { securityGroupCluster } }) => ({
      IpPermission: {
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
        UserIdGroupPairs: [{ GroupId: securityGroupCluster.live?.GroupId }],
        ToPort: 65535,
      },
    }),
  });

  // Asymmetric Key
  const key = provider.kms.makeKey({
    name: formatName(config.eks.key.name, config),
    properties: () => ({}),
  });

  // define the EKS cluster
  const cluster = provider.eks.makeCluster({
    name: formatName(clusterName, config),
    namespace,
    dependencies: {
      subnets: [...subnetsPublic, ...pluck("subnet")(privates)],
      securityGroups: [securityGroupCluster, securityGroupNodes],
      role: roleCluster,
      key,
    },
  });

  // defines a bunch of Node Groups on public subnets
  /*
  const nodeGroupsPublic = await map((nodeGroup) =>
    provider.eks.makeNodeGroup({
      name: nodeGroup.name,
      dependencies: {
        subnets: subnetsPublic,
        cluster,
        role: roleNodeGroup,
      },
      properties: nodeGroup.properties,
    })
  )(config.eks.nodeGroupsPublic);
*/
  // Create a bunch of Node Groups on private subnets
  const nodeGroupsPrivate = await map((nodeGroup) =>
    provider.eks.makeNodeGroup({
      name: formatName(nodeGroup.name, config),
      namespace,
      dependencies: {
        subnets: pluck("subnet")(privates),
        cluster,
        role: roleNodeGroup,
      },
      properties: nodeGroup.properties,
    })
  )(config.eks.nodeGroupsPrivate);

  return {
    roleCluster,
    roleNodeGroup,
    securityGroupCluster,
    cluster,
    //nodeGroupsPublic,
    nodeGroupsPrivate,
  };
};

exports.createResources = createResources;
