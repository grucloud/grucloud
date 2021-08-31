module.exports = ({}) => ({
  EKS: {
    cluster: {
      properties: {
        resourcesVpcConfig: {
          endpointPublicAccess: false,
          endpointPrivateAccess: true,
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
            maxSize: 2,
            desiredSize: 2,
          },
          // instanceTypes: ["t2.large"],
          // amiType: "AL2_x86_64",
          // labels: {},
          // diskSize: 20,
        },
      },
    },
  },
});
