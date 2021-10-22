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
    name: "ClusterSharedNode",
    properties: ({ config }) => ({
      Description: "Communication between all nodes in the cluster",
    }),
    dependencies: ({ resources }) => ({
      vpc: resources.EC2.Vpc.vpc,
    }),
  });

  provider.EC2.makeSecurityGroupRuleIngress({
    name: "ClusterSharedNode-rule-ingress-all-from-ClusterSharedNode",
    properties: ({ config }) => ({
      IpPermission: {
        IpProtocol: "-1",
        FromPort: -1,
        ToPort: -1,
      },
    }),
    dependencies: ({ resources }) => ({
      securityGroup: resources.EC2.SecurityGroup.clusterSharedNode,
      securityGroupFrom: resources.EC2.SecurityGroup.clusterSharedNode,
    }),
  });
};

exports.createResources = createResources;
