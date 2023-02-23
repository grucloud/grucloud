const pkg = require("./package.json");

module.exports = ({}) => {
  return {
    projectName: "ex-eks-mod",
    //    formatName: (name, config) => `${name}-${config.projectName}`,
    formatName: (name, config) => name,
    includeGroups: [
      "ACM",
      "AutoScaling",
      "EC2",
      "EKS",
      "ElasticLoadBalancingV2",
      "IAM",
      "KMS",
      "Route53",
      "Route53Domains",
    ],
  };
};
