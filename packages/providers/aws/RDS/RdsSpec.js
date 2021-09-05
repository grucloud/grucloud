const assert = require("assert");
const { pipe, assign, map, omit, tap, get } = require("rubico");
const { compare } = require("@grucloud/core/Common");

const { isOurMinionFactory, isOurMinion } = require("../AwsCommon");
const { DBCluster } = require("./DBCluster");
const { DBInstance } = require("./DBInstance");
const { DBSubnetGroup } = require("./DBSubnetGroup");

const GROUP = "RDS";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "DBSubnetGroup",
      dependsOn: ["EC2::Subnet"],
      Client: DBSubnetGroup,
      isOurMinion,
      compare: compare({
        filterAll: pipe([omit(["SubnetIds", "Tags"])]),
      }),
    },
    {
      type: "DBCluster",
      dependsOn: ["RDS::DBSubnetGroup", "EC2::SecurityGroup", "KMS::Key"],
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
        "RDS::DBSubnetGroup",
        "RDS::DBCluster",
        "EC2::InternetGateway",
        "EC2::SecurityGroup",
        "EC2::NetworkInterface",
      ],
      Client: DBInstance,
      isOurMinion: isOurMinionFactory({ tags: "TagList" }),
      compare: compare({
        filterAll: omit(["Tags"]),
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          omit([
            "VpcSecurityGroupIds",
            "MasterUserPassword",
            "DBSubnetGroupName",
          ]),
        ]),
      }),
    },
  ]);
