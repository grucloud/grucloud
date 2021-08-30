const clusterName = "cluster";

module.exports = ({}) => ({
  eks: {
    cluster: {
      name: clusterName,
      properties: {
        resourcesVpcConfig: {
          endpointPublicAccess: true,
          endpointPrivateAccess: false,
        },
      },
    },
    NodeGroup: {
      nodeGroupPrivateCluster: {
        name: "node-group-private-cluster",
        properties: {
          capacityType: "ON_DEMAND",
          scalingConfig: {
            minSize: 1,
            maxSize: 1,
            desiredSize: 1,
          },
          instanceTypes: ["t2.small"],
          amiType: "AL2_x86_64",
          labels: {},
          diskSize: 20,
        },
      },
    },
    key: {
      name: "eks-key",
    },

    roleCluster: { name: `role-cluster` },
    roleNodeGroup: { name: `role-node-group` },
    securityGroupCluster: { name: "security-group-cluster" },
    securityGroupNode: { name: "security-group-node" },
  },
  vpc: {
    vpc: {
      Tags: [{ Key: `kubernetes.io/cluster/${clusterName}`, Value: "shared" }],
    },
    subnets: {
      privateTags: [
        {
          Key: `kubernetes.io/cluster/${clusterName}`,
          Value: "shared",
        },
        { Key: "kubernetes.io/role/internal-elb", Value: "1" },
      ],
      publicTags: [
        {
          Key: `kubernetes.io/cluster/${clusterName}`,
          Value: "shared",
        },
        { Key: "kubernetes.io/role/elb", Value: "1" },
      ],
    },
  },
});
