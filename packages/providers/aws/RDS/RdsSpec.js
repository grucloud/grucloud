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
      dependsOn: ["ec2::Subnet"],
      Client: DBSubnetGroup,
      isOurMinion,
      //TODO compare:
    },
    {
      type: "DBCluster",
      dependsOn: ["rds::DBSubnetGroup", "ec2::SecurityGroup"],
      Client: DBCluster,
      isOurMinion: isOurMinionFactory({ tags: "TagList" }),
      //TODO compare
    },
    {
      type: "DBInstance",
      dependsOn: [
        "rds::DBSubnetGroup",
        "rds::DBCluster",
        "ec2::InternetGateway",
        "ec2::SecurityGroup",
      ],
      Client: DBInstance,
      isOurMinion: isOurMinionFactory({ tags: "TagList" }),
      compare: compareDBInstance,
    },
  ]);
