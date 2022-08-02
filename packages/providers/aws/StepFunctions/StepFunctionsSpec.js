const assert = require("assert");
const {
  assign,
  map,
  pipe,
  tap,
  get,
  and,
  or,
  switchCase,
  eq,
} = require("rubico");
const {
  defaultsDeep,
  when,
  callProp,
  isString,
  uniq,
  pluck,
  find,
} = require("rubico/x");
const { cloneDeepWith } = require("lodash/fp");
const { flattenObject } = require("@grucloud/core/Common");

const { replaceWithName } = require("@grucloud/core/Common");

const {
  isOurMinion,
  compareAws,
  replaceArnWithAccountAndRegion,
} = require("../AwsCommon");
const { StepFunctionsStateMachine } = require("./StepFunctionsStateMachine");

const GROUP = "StepFunctions";
const tagsKey = "tags";
const compareStepFunctions = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    {
      type: "StateMachine",
      Client: StepFunctionsStateMachine,
      inferName: get("properties.name"),
      omitProperties: ["roleArn", "creationDate", "stateMachineArn", "status"],
      propertiesDefault: {
        type: "STANDARD",
        loggingConfiguration: { includeExecutionData: false, level: "OFF" },
        tracingConfiguration: {
          enabled: false,
        },
      },
      dependencies: {
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("roleArn"),
        },
        glueJob: {
          type: "Job",
          group: "Glue",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("definition.States"),
              flattenObject({ filterKey: (key) => key === "JobName" }),
              map(
                pipe([
                  (id) =>
                    lives.getById({
                      id,
                      type: "Job",
                      group: "Glue",
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])
              ),
              //TODO move uniq to flattenObject
              uniq,
            ]),
        },
        logGroups: {
          type: "LogGroup",
          group: "CloudWatchLogs",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("loggingConfiguration.destinations"),
              pluck("cloudWatchLogsLogGroup"),
              pluck("logGroupArn"),
              map((logGroupArn) =>
                pipe([
                  () =>
                    lives.getByType({
                      type: "LogGroup",
                      group: "CloudWatchLogs",
                      providerName: config.providerName,
                    }),
                  find(({ id }) => logGroupArn.includes(id)),
                  get("id"),
                ])()
              ),
            ]),
        },
        lambdaFunctions: {
          type: "Function",
          group: "Lambda",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("definition.States"),
              flattenObject({ filterKey: (key) => key === "FunctionName" }),
              map(
                pipe([
                  (id) =>
                    lives.getById({
                      id,
                      type: "Function",
                      group: "Lambda",
                      providerName: config.providerName,
                    }),
                  get("id"),
                ])
              ),
              //TODO move uniq to flattenObject
              uniq,
            ]),
        },
        //TODO
        // snsTopics: {
        //   type: "Topic",
        //   group: "SNS",
        //   list: true,
        //   dependencyId: ({ lives, config }) => get("WebACLArn"),
        // },
        sqsQueues: {
          type: "Queue",
          group: "SQS",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("definition.States"),
              flattenObject({ filterKey: (key) => key === "QueueUrl" }),
              map((QueueUrl) =>
                pipe([
                  () =>
                    lives.getByType({
                      type: "Queue",
                      group: "SQS",
                      providerName: config.providerName,
                    }),
                  find(eq(get("live.QueueUrl"), QueueUrl)),
                  get("id"),
                ])()
              ),
              //TODO move uniq to flattenObject
              uniq,
            ]),
        },
      },
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          assign({
            definition: pipe([
              get("definition"),
              cloneDeepWith(
                pipe([
                  switchCase([
                    and([
                      isString,
                      or([
                        callProp("startsWith", "https://"),
                        callProp("startsWith", "arn:"),
                        callProp("endsWith", ".amazonaws.com"),
                      ]),
                    ]),
                    pipe([
                      replaceArnWithAccountAndRegion({ providerConfig, lives }),
                    ]),
                    () => undefined,
                  ]),
                ])
              ),
            ]),
          }),
          assign({
            loggingConfiguration: pipe([
              get("loggingConfiguration"),
              when(
                get("destinations"),
                assign({
                  destinations: pipe([
                    get("destinations"),
                    map(
                      assign({
                        cloudWatchLogsLogGroup: pipe([
                          get("cloudWatchLogsLogGroup"),
                          assign({
                            logGroupArn: pipe([
                              get("logGroupArn"),
                              replaceWithName({
                                groupType: "CloudWatchLogs::LogGroup",
                                path: "id",
                                providerConfig,
                                lives,
                              }),
                            ]),
                          }),
                        ]),
                      })
                    ),
                  ]),
                })
              ),
            ]),
          }),
        ]),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      tagsKey,
      compare: compareStepFunctions({}),
    })
  ),
]);
