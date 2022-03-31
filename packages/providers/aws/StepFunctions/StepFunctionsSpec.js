const assert = require("assert");
const { assign, map, pipe, tap, get } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { replaceWithName } = require("@grucloud/core/Common");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { StepFunctionsStateMachine } = require("./StepFunctionsStateMachine");

const GROUP = "StepFunctions";
const compareStepFunctions = compareAws({ tagsKey: "tags" });

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
        tracingConfiguration: {
          enabled: false,
        },
      },
      dependencies: {
        role: { type: "Role", group: "IAM" },
        logGroup: { type: "LogGroup", group: "CloudWatchLogs", list: true },
      },
      filterLive: ({ lives }) =>
        pipe([
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
                                () => ({ Id: logGroupArn, lives }),
                                replaceWithName({
                                  groupType: "CloudWatchLogs::LogGroup",
                                  path: "id",
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
      compare: compareStepFunctions({}),
    })
  ),
]);
