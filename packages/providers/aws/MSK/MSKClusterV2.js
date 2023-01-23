const assert = require("assert");
const { pipe, tap, get, eq, pick, assign, map } = require("rubico");
const { defaultsDeep, identity, flatten, pluck } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");

const { getByNameCore } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./MSKCommon");

const buildArn = () => get("ClusterArn");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  pick(["ClusterArn"]),
]);

exports.MSKClusterV2 = ({}) => ({
  type: "ClusterV2",
  package: "kafka",
  client: "Kafka",
  inferName: () => get("ClusterName"),
  findName: () => pipe([get("ClusterName")]),
  findId: () => pipe([get("ClusterArn")]),
  omitProperties: [
    "ClusterArn",
    "CreationTime",
    "State",
    "StateInfo",
    "ActiveOperationArn",
    "CurrentVersion",
  ],
  propertiesDefault: {},

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
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#describeClusterV2-property
  getById: {
    method: "describeClusterV2",
    pickId,
    getField: "ClusterInfo",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#listClustersV2-property
  getList: {
    method: "listClustersV2",
    getParam: "ClusterInfoList",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#createClusterV2-property
  create: {
    method: "createClusterV2",
    pickCreated: ({ payload }) => identity,
    isInstanceUp: eq(get("State"), "ACTIVE"),
    isInstanceError: eq(get("State"), "FAILED"),
    getErrorMessage: get("StateInfo.Message", "failed"),
    // TODO retry on "Amazon MSK could not create your cluster because of a service issue. Retry the operation"
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#updateClusterConfiguration-property
  update: {
    method: "updateClusterConfiguration",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ ClusterArn: live.ClusterArn })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#deleteCluster-property
  destroy: {
    method: "deleteCluster",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
