const { isOurMinion } = require("../AwsCommon");
const { AwsLoadBalancer } = require("./AwsLoadBalancer");

module.exports = [
  {
    type: "LoadBalancer",
    Client: AwsLoadBalancer,
    isOurMinion,
  },
];
