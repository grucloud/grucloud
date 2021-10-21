const assert = require("assert");
const { get, pipe, and, tap } = require("rubico");
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

const createResources = ({
  provider,
  resources,
  namespace = NamespaceDefault,
}) => {
  /*
  const { config } = provider;
  const formatName = config.formatName || identity;
  assert(config.EKS);
  assert(config.EKS.cluster);
  assert(config.EKS.roleCluster);
  //assert(config.EKS.nodeGroupsPrivate);

  assert(config.vpc);
  assert(resources);
  assert(resources.vpc);
  const { vpc, subnetsPublic, privates } = resources;
  assert(vpc);
  assert(subnetsPublic);
  const clusterName = config.EKS.cluster.name;
  assert(clusterName);

  const iamPolicyEKSCluster = provider.IAM.usePolicy({
    name: "AmazonEKSClusterPolicy",
    namespace,
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
    }),
  });

  const iamPolicyEKSVPCResourceController = provider.IAM.usePolicy({
    name: "AmazonEKSVPCResourceController",
    namespace,
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
    }),
  });

  const roleCluster = provider.IAM.makeRole({
    name: formatName(config.EKS.roleCluster.name, config),
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

  const iamPolicyEKSWorkerNode = provider.IAM.usePolicy({
    name: "AmazonEKSWorkerNodePolicy",
    namespace,
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    }),
  });

  const iamPolicyEC2ContainerRegistryReadOnly = provider.IAM.usePolicy({
    name: "AmazonEC2ContainerRegistryReadOnly",
    namespace,
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    }),
  });

  const iamPolicyEKS_CNI = provider.IAM.usePolicy({
    name: "AmazonEKS_CNI_Policy",
    namespace,
    properties: () => ({
      Arn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    }),
  });

  const roleNodeGroup = provider.IAM.makeRole({
    name: formatName(config.EKS.roleNodeGroup.name, config),
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

  const securityGroupCluster = provider.EC2.makeSecurityGroup({
    name: formatName(config.EKS.securityGroupCluster.name, config),
    namespace,
    dependencies: { vpc },
    properties: () => ({
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      Description: "EKS Cluster Security Group",
    }),
  });

  const sgClusterRuleIngressHttps = provider.EC2.makeSecurityGroupRuleIngress({
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
  const sgClusterRuleEgress = provider.EC2.makeSecurityGroupRuleEgress({
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

  const securityGroupNodes = provider.EC2.makeSecurityGroup({
    name: formatName(config.EKS.securityGroupNode.name, config),
    namespace,
    dependencies: { vpc },
    properties: () => ({
      Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "owned" }],
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      Description: "SG for the EKS Nodes",
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
    }),
  });

  const sgNodesRuleIngressCluster = provider.EC2.makeSecurityGroupRuleIngress({
    name: formatName("sg-rule-node-group-ingress-cluster", config),
    namespace,
    dependencies: {
      securityGroup: securityGroupNodes,
      securityGroupFrom: securityGroupCluster,
    },
    properties: () => ({
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
        ToPort: 65535,
      },
    }),
  });

  // Asymmetric Key
  const key = provider.KMS.makeKey({
    name: formatName(config.EKS.key.name, config),
    properties: () => ({}),
  });

  // define the EKS cluster
  const cluster = provider.EKS.makeCluster({
    name: formatName(clusterName, config),
    namespace,
    dependencies: {
      subnets: [...subnetsPublic, ...pluck("subnet")(privates)],
      securityGroups: [securityGroupCluster, securityGroupNodes],
      role: roleCluster,
      key,
    },
    properties: ({ config }) => config.EKS.cluster.properties,
  });

  // Create a node group on private subnets
  const nodeGroupPrivate = provider.EKS.makeNodeGroup({
    name: get("config.EKS.NodeGroup.nodeGroupPrivateCluster.name"),
    namespace: "EKS",
    properties: get("config.EKS.NodeGroup.nodeGroupPrivateCluster.properties"),
    dependencies: {
      subnets: pluck("subnet")(privates),
      cluster,
      role: roleNodeGroup,
    },
  });

  return {
    roleCluster,
    roleNodeGroup,
    securityGroupCluster,
    cluster,
    nodeGroupPrivate,
  };
  */
};

exports.createResources = createResources;
