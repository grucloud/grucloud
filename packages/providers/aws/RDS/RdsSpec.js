const { isOurMinionFactory, isOurMinion } = require("../AwsCommon");
const { DBCluster } = require("./DBCluster");
const { DBInstance } = require("./DBInstance");
const { DBSubnetGroup } = require("./DBSubnetGroup");

module.exports = [
  {
    type: "DBSubnetGroup",
    dependsOn: ["Subnet"],
    Client: DBSubnetGroup,
    isOurMinion,
    //TODO compare
  },
  {
    type: "DBCluster",
    dependsOn: ["DBSubnetGroup"],
    Client: DBCluster,
    isOurMinion: isOurMinionFactory({ tags: "TagList" }),
    //TODO compare
  },
  {
    type: "DBInstance",
    dependsOn: ["DBSubnetGroup", "DBCluster"],
    Client: DBInstance,
    isOurMinion: isOurMinionFactory({ tags: "TagList" }),
    //TODO compare
  },
];
