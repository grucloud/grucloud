const assert = require("assert");
const { pipe, tap, get, eq, pick, map, assign } = require("rubico");
const { defaultsDeep, identity, when } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");

const { getByNameCore } = require("@grucloud/core/Common");

const { envVarName } = require("@grucloud/core/generatorUtils");
const { deepOmit } = require("@grucloud/core/deepOmit");

const { Tagger } = require("./MQCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () => get("BrokerArn");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  pick(["BrokerId"]),
]);

exports.MQBroker = ({ compare }) => ({
  type: "Broker",
  package: "mq",
  client: "Mq",
  inferName: () => get("BrokerName"),
  findName: () => pipe([get("BrokerName")]),
  findId: () => pipe([get("BrokerId")]),
  omitProperties: [
    "BrokerArn",
    "BrokerId",
    "BrokerState",
    "Created",
    "SubnetIds",
    "SecurityGroups",
    "BrokerInstances",
    "Configuration",
    "Logs.AuditLogGroup",
    "Logs.GeneralLogGroup",
  ],
  propertiesDefault: {},
  dependencies: {
    configuration: {
      type: "Configuration",
      group: "MQ",
      dependencyId: ({ lives, config }) => pipe([get("Configuration.Id")]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("EncryptionOptions.KmsKeyId"),
    },
    logGroupAudit: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) => get("Logs.AuditLogGroup"),
    },
    logGroupGeneral: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) => get("Logs.GeneralLogGroup"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      excludeDefaultDependencies: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroups"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      excludeDefaultDependencies: true,
      dependencyIds: ({ lives, config }) => get("SubnetIds"),
    },
  },
  compare: compare({
    filterTarget: () => pipe([deepOmit(["Users[].Password"])]),
  }),
  environmentVariables: [
    {
      path: "Users[].Password",
      suffix: "PASSWORD",
      array: true,
      rejectEnvironmentVariable: () => () => true,
      writeInEnvFile: () => () => true,
    },
  ],
  filterLive:
    ({ lives, providerConfig }) =>
    (live) =>
      pipe([
        () => live,
        assign({
          Users: pipe([
            get("Users"),
            map.withIndex((user, index) =>
              pipe([
                () => user,
                assign({
                  Password: pipe([
                    () => () =>
                      `JSON.parse(process.env.${envVarName({
                        name: live.BrokerName,
                        suffix: `PASSWORD`,
                      })})[${index}]`,
                  ]),
                }),
              ])()
            ),
          ]),
        }),
      ])(),
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#describeBroker-property
  getById: {
    method: "describeBroker",
    pickId,
    decorate:
      ({ endpoint }) =>
      (live) =>
        pipe([
          () => live,
          ({ Configurations: { Current }, ...other }) => ({
            Configuration: Current,
            ...other,
          }),
          assign({
            Users: pipe([
              () => live,
              pick(["BrokerId"]),
              endpoint().listUsers,
              get("Users"),
            ]),
          }),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#listBrokers-property
  getList: {
    method: "listBrokers",
    getParam: "BrokerSummaries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#createBroker-property
  create: {
    method: "createBroker",
    pickCreated: ({ payload }) => identity,
    isInstanceUp: eq(get("BrokerState"), "RUNNING"),
    isInstanceError: eq(get("BrokerState"), "CREATION_FAILED"),
    configIsUp: { retryCount: 50 * 12, retryDelay: 5e3 },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#updateBroker-property
  update: {
    method: "updateBroker",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ BrokerId: live.BrokerId })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#deleteBroker-property
  destroy: {
    method: "deleteBroker",
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
    dependencies: {
      configuration,
      //TODO
      logGroupAudit,
      logGroupGeneral,
      subnets,
      securityGroups,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => configuration,
        defaultsDeep({
          Configuration: { Id: getField(configuration, "Id") },
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          SecurityGroups: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
        })
      ),
    ])(),
});
