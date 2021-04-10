const assert = require("assert");
const { map, pipe, and, tap } = require("rubico");
const { pluck } = require("rubico/x");

exports.config = require("./config");
exports.hooks = require("./hooks");

//const podPolicy = require("./pod-policy.json");

const isProviderUp = ({ resources }) =>
  pipe([
    and([() => resources.cluster.getLive()]),
    tap((isUp) => {
      assert(true);
    }),
  ])();

exports.isProviderUp = isProviderUp;

const createResources = async ({ provider, resources }) => {
  const { config } = provider;
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

  const iamPolicyEKSCluster = await provider.useIamPolicyReadOnly({
    name: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
  });

  const iamPolicyEKSVPCResourceController = await provider.useIamPolicyReadOnly(
    {
      name: "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController",
    }
  );

  const roleCluster = await provider.makeIamRole({
    name: config.eks.roleCluster.name,
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

  // define the EKS cluster
  const cluster = await provider.makeEKSCluster({
    name: clusterName,
    dependencies: {
      subnets: [...subnetsPublic, ...pluck("subnet")(privates)],
      securityGroups: [securityGroupCluster, securityGroupNodes],
      role: roleCluster,
    },
  });

  // defines a bunch of Node Groups on public subnets
  /*
  const nodeGroupsPublic = await map((nodeGroup) =>
    provider.makeEKSNodeGroup({
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
    provider.makeEKSNodeGroup({
      name: nodeGroup.name,
      dependencies: {
        subnets: pluck("subnet")(privates),
        cluster,
        role: roleNodeGroup,
      },
      properties: nodeGroup.properties,
    })
  )(config.eks.nodeGroupsPrivate);

  /*
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
  */

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
