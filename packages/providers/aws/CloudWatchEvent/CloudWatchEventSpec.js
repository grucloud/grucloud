const assert = require("assert");
const { tap, pipe, map, omit, pick, get, assign } = require("rubico");
const { defaultsDeep, unless, callProp, when } = require("rubico/x");

const {
  compareAws,
  isOurMinion,
  replaceAccountAndRegion,
} = require("../AwsCommon");
const { envVarName } = require("@grucloud/core/generatorUtils");

const { CloudWatchEventConnection } = require("./CloudWatchEventConnection");
const { CloudWatchEventBus } = require("./CloudWatchEventBus");
const { CloudWatchEventRule } = require("./CloudWatchEventRule");
const {
  CloudWatchEventTarget,
  EventTargetDependencies,
} = require("./CloudWatchEventTarget");
const {
  CloudWatchEventApiDestination,
} = require("./CloudWatchEventApiDestination");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html
const GROUP = "CloudWatchEvents";
const compareCloudWatchEvent = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "ApiDestination",
      inferName: () => get("Name"),
      Client: CloudWatchEventApiDestination,
      dependencies: {
        connection: {
          type: "Connection",
          group: GROUP,
          parent: true,
          dependencyId: ({ lives, config }) => get("ConnectionArn"),
        },
      },
      omitProperties: [
        "ConnectionArn",
        "ApiDestinationArn",
        "ApiDestinationState",
        "CreationTime",
        "LastModifiedTime",
      ],
    },
    {
      type: "Connection",
      Client: CloudWatchEventConnection,
      inferName: () => get("Name"),
      dependencies: {
        secret: {
          type: "Secret",
          group: "SecretsManager",
          excludeDefaultDependencies: true,
          dependencyId: ({ lives, config }) => get("SecretArn"),
        },
      },
      omitProperties: [
        "ConnectionArn",
        "CreationTime",
        "LastAuthorizedTime",
        "LastModifiedTime",
        "ConnectionState",
        "SecretArn",
      ],
      environmentVariables: [
        {
          path: "AuthParameters.ApiKeyAuthParameters.ApiKeyValue",
          suffix: "API_KEY_VALUE",
          rejectEnvironmentVariable: () =>
            pipe([get("AuthParameters.ApiKeyAuthParameters")]),
        },
        {
          path: "AuthParameters.BasicAuthParameters.Password",
          suffix: "PASSWORD",
          rejectEnvironmentVariable: () =>
            pipe([get("AuthParameters.BasicAuthParameters")]),
        },
      ],
      compare: compareCloudWatchEvent({
        filterAll: () =>
          pipe([
            omit([
              "AuthParameters.ApiKeyAuthParameters.ApiKeyValue",
              "AuthParameters.BasicAuthParameters.Password",
            ]),
          ]),
      }),
    },
    {
      type: "EventBus",
      Client: CloudWatchEventBus,
      inferName: () => get("Name", "default"),
      omitProperties: ["Arn"],
      filterLive: () => pipe([pick(["Name"])]),
    },
    {
      type: "Rule",
      Client: CloudWatchEventRule,
      inferName: () => get("Name"),
      omitProperties: ["Arn", "CreatedBy", "EventBusName"],
      compare: compareCloudWatchEvent({
        filterTarget: () => pipe([defaultsDeep({ EventBusName: "default" })]),
        filterLive: () => pipe([omit(["Arn", "CreatedBy"])]),
      }),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          when(
            get("EventPattern"),
            assign({
              EventPattern: pipe([
                get("EventPattern"),
                when(
                  get("account"),
                  assign({
                    account: pipe([
                      get("account"),
                      map(
                        replaceAccountAndRegion({
                          providerConfig,
                          lives,
                        })
                      ),
                    ]),
                  })
                ),
              ]),
            })
          ),
        ]),
      dependencies: {
        eventBus: {
          type: "EventBus",
          group: "CloudWatchEvents",
          excludeDefaultDependencies: true,
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              get("EventBusName"),
              (name) =>
                lives.getByName({
                  name,
                  type: "EventBus",
                  group: "CloudWatchEvents",
                  providerName: config.providerName,
                }),
              get("id"),
            ]),
        },
      },
    },
    {
      type: "Target",
      Client: CloudWatchEventTarget,
      inferName:
        ({ dependenciesSpec: { rule } }) =>
        ({ Id }) =>
          pipe([
            tap((params) => {
              assert(Id);
              assert(rule);
            }),
            () => `target::${rule}::${Id}`,
          ])(),
      //TODO check update
      omitProperties: ["EventBusName", "Rule", "RoleArn", "Arn"],
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          unless(
            pipe([get("Arn"), callProp("startsWith", "arn:aws:autoscaling")]),
            omit(["Arn"])
          ),
        ]),
      dependencies: {
        rule: {
          type: "Rule",
          group: "CloudWatchEvents",
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              get("Rule"),
              (name) =>
                lives.getByName({
                  name,
                  type: "Rule",
                  group: "CloudWatchEvents",
                  providerName: config.providerName,
                }),
              get("id"),
            ]),
        },
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("RoleArn"),
        },
        //TODO https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putTargets-property
        ...EventTargetDependencies,
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareCloudWatchEvent({}),
      isOurMinion,
    })
  ),
]);
