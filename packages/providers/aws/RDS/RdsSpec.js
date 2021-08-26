const { pipe, assign, map, omit } = require("rubico");
const { compare } = require("@grucloud/core/Common");

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
      compare: compare({
        filterAll: pipe([omit(["SubnetIds", "Tags"])]),
      }),
    },
    {
      type: "DBCluster",
      dependsOn: ["rds::DBSubnetGroup", "ec2::SecurityGroup", "kms::Key"],
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
        "ec2:NetworkInterface",
      ],
      Client: DBInstance,
      isOurMinion: isOurMinionFactory({ tags: "TagList" }),
      compare: compareDBInstance,
    },
  ]);
