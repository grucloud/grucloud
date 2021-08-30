const assert = require("assert");
const { pipe, assign, map, omit, tap, get } = require("rubico");
const { compare } = require("@grucloud/core/Common");

const { isOurMinionFactory, isOurMinion } = require("../AwsCommon");
const { DBCluster } = require("./DBCluster");
const { DBInstance } = require("./DBInstance");
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
      compare: compare({
        filterAll: pipe([omit(["SubnetIds", "Tags"])]),
        filterTarget: pipe([
          omit([
            "VpcSecurityGroupIds",
            "MasterUserPassword",
            "DBSubnetGroupName",
          ]),
        ]),
        filterLive: pipe([
          assign({ ScalingConfiguration: get("ScalingConfigurationInfo") }),
          omit(["ScalingConfigurationInfo"]),
        ]),
      }),
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
      compare: compare({
        filterAll: omit(["Tags"]),
        filterTarget: pipe([
          omit([
            "VpcSecurityGroupIds",
            "MasterUserPassword",
            "DBSubnetGroupName",
          ]),
        ]),
      }),
    },
  ]);
