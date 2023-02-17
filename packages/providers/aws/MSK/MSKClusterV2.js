const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  pick,
  assign,
  map,
  fork,
  set,
  omit,
} = require("rubico");
const { defaultsDeep, identity, flatten, pluck, when } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

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

const decorate = () =>
  pipe([
    when(
      get("Provisioned.CurrentBrokerSoftwareInfo.KafkaVersion"),
      pipe([
        set(
          "Provisioned.KafkaVersion",
          get("Provisioned.CurrentBrokerSoftwareInfo.KafkaVersion")
        ),
        omit(["Provisioned.CurrentBrokerSoftwareInfo"]),
      ])
    ),
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
    "Provisioned.EncryptionInfo.EncryptionAtRest",
    "Provisioned.ZookeeperConnectString",
    "Provisioned.ZookeeperConnectStringTls",
    "ClusterType",
  ],
  propertiesDefault: {},
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Provisioned.EncryptionInfo.EncryptionAtRest.DataVolumeKMSKeyId"),
        ]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          fork({
            provisioned: pipe([
              get("Provisioned.BrokerNodeGroupInfo.ClientSubnets"),
            ]),
            serverless: pipe([
              get("Serverless.VpcConfigs"),
              pluck("SubnetIds"),
              flatten,
            ]),
          }),
          ({ serverless = [], provisioned = [] }) => [
            ...serverless,
            ...provisioned,
          ],
        ]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          fork({
            provisioned: pipe([
              get("Provisioned.BrokerNodeGroupInfo.SecurityGroups"),
            ]),
            serverless: pipe([
              get("Serverless.VpcConfigs"),
              pluck("SecurityGroupIds"),
              flatten,
            ]),
          }),
          ({ serverless = [], provisioned = [] }) => [
            ...serverless,
            ...provisioned,
          ],
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      when(
        get("Provisioned"),
        assign({
          Provisioned: pipe([
            get("Provisioned"),
            assign({
              BrokerNodeGroupInfo: pipe([
                get("BrokerNodeGroupInfo"),
                assign({
                  ClientSubnets: pipe([
                    get("ClientSubnets"),
                    map(
                      replaceWithName({
                        groupType: "EC2::Subnet",
                        path: "id",
                        providerConfig,
                        lives,
                      })
                    ),
                  ]),
                  SecurityGroups: pipe([
                    get("SecurityGroups"),
                    map(
                      replaceWithName({
                        groupType: "EC2::SecurityGroup",
                        path: "id",
                        providerConfig,
                        lives,
                      })
                    ),
                  ]),
                }),
              ]),
            }),
          ]),
        })
      ),
      when(
        get("Serverless"),
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
        })
      ),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#describeClusterV2-property
  getById: {
    method: "describeClusterV2",
    pickId,
    getField: "ClusterInfo",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#listClustersV2-property
  getList: {
    method: "listClustersV2",
    getParam: "ClusterInfoList",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kafka.html#createClusterV2-property
  create: {
    method: "createClusterV2",
    pickCreated: ({ payload }) => identity,
    isInstanceUp: eq(get("State"), "ACTIVE"),
    isInstanceError: eq(get("State"), "FAILED"),
    getErrorMessage: get("StateInfo.Message", "failed"),
    configIsUp: { retryCount: 40 * 12, retryDelay: 5e3 },
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
    shouldRetryOnExceptionMessages: ["You can't delete cluster in"],
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
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          Provisioned: {
            EncryptionInfo: {
              EncryptionAtRest: { DataVolumeKMSKeyId: getField(kmsKey, "Arn") },
            },
          },
        })
      ),
    ])(),
});
