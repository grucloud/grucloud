const pkg = require("./package.json");

module.exports = ({}) => {
  return {
    projectName: "ex-eks-mod",
    //    formatName: (name, config) => `${name}-${config.projectName}`,
    formatName: (name, config) => name,
    EKS: {
      cluster: {
        name: "my-cluster",
        properties: {
          resourcesVpcConfig: {
            endpointPublicAccess: true,
            endpointPrivateAccess: false,
          },
        },
      },
    },
  };
};
