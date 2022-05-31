const assert = require("assert");
const { assign, map, pipe, tap, get, and, or, switchCase } = require("rubico");
const { defaultsDeep, when, callProp, isString } = require("rubico/x");
const { cloneDeepWith } = require("lodash/fp");

const { replaceWithName } = require("@grucloud/core/Common");

const {
  isOurMinion,
  compareAws,
  replaceAccountAndRegion,
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
      omitProperties: [
        "name",
        "roleArn",
        "creationDate",
        "stateMachineArn",
        "status",
      ],
      propertiesDefault: {
        type: "STANDARD",
        loggingConfiguration: { includeExecutionData: false, level: "OFF" },
        tracingConfiguration: {
          enabled: false,
        },
      },
      dependencies: {
        role: { type: "Role", group: "IAM" },
        logGroups: { type: "LogGroup", group: "CloudWatchLogs", list: true },
        lambdaFunctions: { type: "Function", group: "Lambda", list: true },
        snsTopics: { type: "Topic", group: "SNS", list: true },
        sqsQueues: { type: "Queue", group: "SQS", list: true },
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
                    pipe([replaceAccountAndRegion({ providerConfig, lives })]),
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
                            logGroupArn: ({ logGroupArn }) =>
                              pipe([
                                () => ({ Id: logGroupArn }),
                                replaceWithName({
                                  groupType: "CloudWatchLogs::LogGroup",
                                  path: "id",
                                  providerConfig,
                                  lives,
                                }),
                              ])(),
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
