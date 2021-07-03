const { pipe, assign, map } = require("rubico");
const { isOurMinionFactory, isOurMinion } = require("../AwsCommon");
const { DBCluster } = require("./DBCluster");
const { DBInstance, compareDBInstance } = require("./DBInstance");
const { DBSubnetGroup } = require("./DBSubnetGroup");

const GROUP = "rds";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "DBSubnetGroup",
      dependsOn: ["Subnet"],
      Client: DBSubnetGroup,
      isOurMinion,
      //TODO compare:
    },
    {
      type: "DBCluster",
      dependsOn: ["DBSubnetGroup", "SecurityGroup"],
      Client: DBCluster,
      isOurMinion: isOurMinionFactory({ tags: "TagList" }),
      //TODO compare
    },
    {
      type: "DBInstance",
      dependsOn: [
        "DBSubnetGroup",
        "DBCluster",
        "InternetGateway",
        "SecurityGroup",
      ],
      Client: DBInstance,
      isOurMinion: isOurMinionFactory({ tags: "TagList" }),
      compare: compareDBInstance,
    },
  ]);
