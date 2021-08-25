module.exports = ({}) => ({
  eks: {
    cluster: {
      properties: {
        resourcesVpcConfig: {
          endpointPublicAccess: false,
          endpointPrivateAccess: true,
        },
      },
    },
  },
});
