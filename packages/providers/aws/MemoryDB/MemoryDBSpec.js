const assert = require("assert");
const { tap, pipe, map, get, omit } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "MemoryDB";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { MemoryDBACL } = require("./MemoryDBACL");
const { MemoryDBCluster } = require("./MemoryDBCluster");
const { MemoryDBParameterGroup } = require("./MemoryDBParameterGroup");
const { MemoryDBSubnetGroup } = require("./MemoryDBSubnetGroup");
const { MemoryDBUser } = require("./MemoryDBUser");

module.exports = pipe([
  () => [
    {
      type: "ACL",
      Client: MemoryDBACL,
      omitProperties: [
        "Status",
        "Clusters",
        "ARN",
        "MinimumEngineVersion",
        "UserNames",
      ],
      inferName: get("properties.Name"),
      dependencies: {
        users: {
          type: "User",
          group: GROUP,
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("UserNames"),
              tap((params) => {
                assert(true);
              }),
            ]),
        },
      },
    },
    {
      type: "Cluster",
      Client: MemoryDBCluster,
      propertiesDefault: {
        TLSEnabled: true,
        AutoMinorVersionUpgrade: true,
        SnapshotRetentionLimit: 1,
      },
      //compare: compare({ filterTarget: () => omit([]) }),
      omitProperties: [
        "ARN",
        "SecurityGroups",
        "EnginePatchVersion",
        "KmsKeyId",
        "Status",
        "PendingUpdates",
        "ClusterEndpoint",
        "ParameterGroupStatus",
        "SnsTopicStatus",
        "SnsTopicArn",
        "ACLName",
        "SubnetGroupName",
        "ParameterGroupName",
        "SecurityGroupIds",
      ],
      inferName: get("properties.Name"),
      includeDefaultDependencies: true,
      dependencies: {
        acl: {
          type: "ACL",
          group: GROUP,
          dependencyId: ({ lives, config }) => get("ACLName"),
        },
        kmsKey: {
          type: "Key",
          group: "KMS",
          dependencyId: ({ lives, config }) => get("KmsKeyId"),
        },
        parameterGroup: {
          type: "ParameterGroup",
          group: GROUP,
          dependencyId: ({ lives, config }) =>
            pipe([get("ParameterGroupName")]),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("SecurityGroups"), pluck("SecurityGroupId")]),
        },
        snsTopic: {
          type: "Topic",
          group: "SNS",
          dependencyId: ({ lives, config }) => get("SnsTopicArn"),
        },
        subnetGroup: {
          type: "SubnetGroup",
          group: GROUP,
          dependencyId: ({ lives, config }) => get("SubnetGroupName"),
        },
      },
    },
    {
      type: "ParameterGroup",
      Client: MemoryDBParameterGroup,
      omitProperties: ["ARN"],
      inferName: get("properties.Name"),
    },
    {
      type: "SubnetGroup",
      Client: MemoryDBSubnetGroup,
      omitProperties: ["ARN", "VpcId", "Subnets", "SubnetIds"],
      inferName: get("properties.Name"),
      dependencies: {
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          includeDefaultDependencies: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("Subnets"), pluck("Identifier")]),
        },
      },
    },
    {
      type: "User",
      Client: MemoryDBUser,
      omitProperties: [
        "Authentication",
        "ACLNames",
        "ARN",
        "MinimumEngineVersion",
        "Status",
      ],
      inferName: get("properties.Name"),
      environmentVariables: [
        {
          path: "AuthenticationMode.Passwords",
          suffix: "MEMORYDB_USER_PASSWORDS",
          array: true,
        },
      ],
      compare: compare({
        filterTarget: () => pipe([omit(["AuthenticationMode"])]),
      }),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);