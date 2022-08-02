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
      inferName: get("properties.Name"),
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
      inferName: get("properties.Name"),
      dependencies: {
        secret: {
          type: "Secret",
          group: "SecretsManager",
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
          handledByResource: true,
        },
        {
          path: "AuthParameters.BasicAuthParameters.Password",
          suffix: "PASSWORD",
          handledByResource: true,
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
      filterLive: () => (live) =>
        pipe([
          () => live,
          assign({
            AuthParameters: pipe([
              get("AuthParameters"),
              when(
                get("ApiKeyAuthParameters"),
                pipe([
                  assign({
                    ApiKeyAuthParameters: pipe([
                      get("ApiKeyAuthParameters"),
                      assign({
                        ApiKeyValue: () => () =>
                          `process.env.${envVarName({
                            name: live.Name,
                            suffix: "API_KEY_VALUE",
                          })}`,
                      }),
                    ]),
                  }),
                ])
              ),
              when(
                get("BasicAuthParameters"),
                pipe([
                  assign({
                    BasicAuthParameters: pipe([
                      get("BasicAuthParameters"),
                      assign({
                        Password: () => () =>
                          `process.env.${envVarName({
                            name: live.Name,
                            suffix: "PASSWORD",
                          })}`,
                      }),
                    ]),
                  }),
                ])
              ),
            ]),
          }),
        ])(),
    },
    {
      type: "EventBus",
      Client: CloudWatchEventBus,
      inferName: get("properties.Name"),
      omitProperties: ["Arn"],
      filterLive: () => pipe([pick(["Name"])]),
    },
    {
      type: "Rule",
      Client: CloudWatchEventRule,
      inferName: get("properties.Name"),
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
      inferName: ({ properties: { Id }, dependenciesSpec: { rule } }) =>
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
