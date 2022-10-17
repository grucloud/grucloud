const assert = require("assert");
const { tap, pipe, map, get, assign } = require("rubico");
const { defaultsDeep, flatten, pluck } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { replaceWithName, omitIfEmpty } = require("@grucloud/core/Common");

const GROUP = "MSK";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { MSKClusterV2 } = require("./MSKClusterV2");
const { MSKConfiguration } = require("./MSKConfiguration");

module.exports = pipe([
  () => [
    {
      type: "Configuration",
      Client: MSKConfiguration,
      omitProperties: [
        "Arn",
        "CreationTime",
        "State",
        "LatestRevision",
        "Revision",
      ],
      propertiesDefault: {},
      inferName: get("properties.Name"),
      filterLive: ({ lives, providerConfig }) =>
        pipe([omitIfEmpty(["KafkaVersions"])]),
    },
    {
      type: "ClusterV2",
      Client: MSKClusterV2,
      omitProperties: [
        "ClusterArn",
        "CreationTime",
        "State",
        "StateInfo",
        "ActiveOperationArn",
        "CurrentVersion",
      ],
      propertiesDefault: {},
      inferName: get("properties.ClusterName"),
      includeDefaultDependencies: true,
      dependencies: {
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([get("Serverless.VpcConfigs"), pluck("SubnetIds"), flatten]),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("Serverless.VpcConfigs"),
              pluck("SecurityGroupIds"),
              flatten,
            ]),
        },
      },
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          assign({
            Serverless: pipe([
              get("Serverless"),
              assign({
                VpcConfigs: pipe([
                  get("VpcConfigs"),
                  map(
                    assign({
                      SubnetIds: pipe([
                        get("SubnetIds"),
                        map(
                          replaceWithName({
                            groupType: "EC2::Subnet",
                            path: "id",
                            providerConfig,
                            lives,
                          })
                        ),
                      ]),
                      SecurityGroupIds: pipe([
                        get("SecurityGroupIds"),
                        map(
                          replaceWithName({
                            groupType: "EC2::SecurityGroup",
                            path: "id",
                            providerConfig,
                            lives,
                          })
                        ),
                      ]),
                    })
                  ),
                ]),
              }),
            ]),
          }),
        ]),
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
