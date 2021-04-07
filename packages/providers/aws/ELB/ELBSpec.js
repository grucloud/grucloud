const { isOurMinion } = require("../AwsCommon");
const { AwsLoadBalancer } = require("./AwsLoadBalancer");

module.exports = [
  {
    type: "LoadBalancer",
    dependsOn: ["Subnet", "SecurityGroup", "Certificate"],
    Client: AwsLoadBalancer,
    isOurMinion,
  },
];
