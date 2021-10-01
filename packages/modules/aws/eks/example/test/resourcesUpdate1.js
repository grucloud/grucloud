const createResources = ({ provider }) => {
  provider.EKS.makeCluster({
    name: "cluster",
    properties: ({ config }) => ({
      version: "1.21",
      resourcesVpcConfig: {
        endpointPublicAccess: false,
        endpointPrivateAccess: true,
      },
    }),
    dependencies: ({ resources }) => ({
      subnets: [
        resources.EC2.Subnet.subnetPrivateA,
        resources.EC2.Subnet.subnetPrivateB,
        resources.EC2.Subnet.subnetPublicA,
        resources.EC2.Subnet.subnetPublicB,
      ],
      securityGroups: [
        resources.EC2.SecurityGroup.securityGroupCluster,
        resources.EC2.SecurityGroup.securityGroupNode,
      ],
      role: resources.IAM.Role.roleCluster,
    }),
  });

  provider.EKS.makeNodeGroup({
    name: "node-group-private-cluster",
    properties: ({ config }) => ({
      capacityType: "ON_DEMAND",
      scalingConfig: {
        minSize: 1,
        maxSize: 2,
        desiredSize: 2,
      },
      instanceTypes: ["t2.small"],
      amiType: "AL2_x86_64",
      labels: {},
      diskSize: 20,
    }),
    dependencies: ({ resources }) => ({
      cluster: resources.EKS.Cluster.cluster,
      subnets: [
        resources.EC2.Subnet.subnetPrivateA,
        resources.EC2.Subnet.subnetPrivateB,
      ],
      role: resources.IAM.Role.roleNodeGroup,
    }),
  });
};

exports.createResources = createResources;
