const assert = require("assert");
const { pipe, tap, get, eq, and } = require("rubico");
const { find } = require("rubico/x");

const createResources = ({ provider }) => {
  provider.EC2.makeVpc({
    name: "VPC",
    properties: ({ config }) => ({
      CidrBlock: "192.168.0.0/16",
      DnsSupport: true,
      DnsHostnames: true,
    }),
  });

  provider.EC2.makeSecurityGroup({
    name: "eks-cluster-sg-my-cluster",
    properties: ({ config }) => ({
      Description:
        "EKS created security group applied to ENI that is attached to EKS Control Plane master nodes, as well as any managed workloads.",
      Tags: [
        {
          Key: "kubernetes.io/cluster/my-cluster",
          Value: "owned",
        },
      ],
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.useSecurityGroup({
    name: "eks-cluster-sg-my-cluster-use",
    filterLives: ({ resources }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => resources,
        find(
          pipe([
            get("live.Tags"),
            find(
              and([
                eq(get("Key"), "kubernetes.io/cluster/my-cluster"),
                eq(get("Value"), "owned"),
              ])
            ),
          ])
        ),
        tap((params) => {
          assert(true);
        }),
      ])(),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSecurityGroup({
    name: "ClusterSharedNode",
    properties: ({ config }) => ({
      Description: "Communication between all nodes in the cluster",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "ClusterSharedNode-rule-ingress-all-from-sg-use",
    properties: ({ config }) => ({
      IpPermission: {
        IpProtocol: "-1",
        FromPort: -1,
        ToPort: -1,
      },
    }),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup.clusterSharedNode,
      securityGroupFrom: resources.EC2.SecurityGroup.eksClusterSgMyClusterUse,
    }),
  });
};

exports.createResources = createResources;
