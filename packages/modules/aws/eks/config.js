const clusterName = "cluster";

module.exports = ({}) => ({
  eks: {
    cluster: {
      name: clusterName,
    },
    roleCluster: { name: `role-${clusterName}` },
    nodeGroupsPublic: [
      {
        name: `node-group-public-${clusterName}`,
        properties: () => ({ diskSize: 20, instanceTypes: ["t2.medium"] }),
      },
    ],
    nodeGroupsPrivate: [
      {
        name: `node-group-private-${clusterName}`,
        properties: () => ({ diskSize: 20, instanceTypes: ["t2.medium"] }),
      },
    ],
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
