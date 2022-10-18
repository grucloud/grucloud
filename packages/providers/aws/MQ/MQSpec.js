const assert = require("assert");
const { tap, pipe, map, get, assign, any, eq, and, not } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { envVarName } = require("@grucloud/core/generatorUtils");

const { compareAws } = require("../AwsCommon");

const GROUP = "MQ";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { MQBroker } = require("./MQBroker");
const { MQConfiguration } = require("./MQConfiguration");

module.exports = pipe([
  () => [
    {
      type: "Broker",
      Client: MQBroker,
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
        "Users[].Password",
      ],
      propertiesDefault: {},
      inferName: get("properties.BrokerName"),
      dependencies: {
        configuration: {
          type: "Configuration",
          group: "MQ",
          dependencyId: ({ lives, config }) => pipe([get("Configuration.Id")]),
        },
        kmsKey: {
          type: "Key",
          group: "KMS",
          dependencyId: ({ lives, config }) =>
            get("EncryptionOptions.KmsKeyId"),
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
          dependencyIds: ({ lives, config }) => get("SecurityGroups"),
        },
        subnets: {
          type: "Subnet",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("SubnetIds"),
        },
      },
      environmentVariables: [
        {
          path: "Users[].Password",
          suffix: "PASSWORD",
          array: true,
          handledByResource: true,
        },
      ],
      filterLive:
        ({ lives, providerConfig }) =>
        (live) =>
          pipe([
            () => live,
            tap((params) => {
              assert(true);
            }),
            assign({
              Users: pipe([
                get("Users"),
                map.withIndex((user, index) =>
                  pipe([
                    () => user,
                    assign({
                      Password: pipe([
                        tap((params) => {
                          assert(true);
                        }),
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
    },
    {
      type: "Configuration",
      Client: MQConfiguration,
      ignoreResource:
        ({ lives }) =>
        ({ live }) =>
          pipe([
            tap((params) => {
              assert(lives);
              assert(live.Id);
            }),
            () => lives,
            not(
              any(
                and([
                  eq(get("groupType"), "MQ::Broker"),
                  eq(get("live.Configuration.Id"), live.Id),
                ])
              )
            ),
          ])(),
      omitProperties: [
        "Arn",
        "ConfigurationId",
        "Id",
        "Created",
        "State",
        "LatestRevision",
        "Revision",
      ],
      propertiesDefault: {},
      inferName: get("properties.Name"),
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
