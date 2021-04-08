const { isOurMinion } = require("../AwsCommon");
const { AwsLoadBalancer } = require("./AwsLoadBalancer");

module.exports = [
  {
    type: "LoadBalancerV1",
    dependsOn: ["Subnet", "SecurityGroup", "Certificate"],
    Client: AwsLoadBalancer,
    isOurMinion,
  },
];
