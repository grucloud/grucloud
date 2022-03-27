const assert = require("assert");
const { tap, pipe, map, omit, pick, get } = require("rubico");
const { defaultsDeep, unless, callProp } = require("rubico/x");

const { compareAws, isOurMinion } = require("../AwsCommon");

const { CloudWatchEventBus } = require("./CloudWatchEventBus");
const { CloudWatchEventRule } = require("./CloudWatchEventRule");
const { CloudWatchEventTarget } = require("./CloudWatchEventTarget");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html
const GROUP = "CloudWatchEvents";
const compareCloudWatchEvent = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "EventBus",
      Client: CloudWatchEventBus,
      omitProperties: ["Arn"],
      filterLive: () => pipe([pick([])]),
    },
    {
      type: "Rule",
      Client: CloudWatchEventRule,
      omitProperties: ["Name", "Arn", "CreatedBy"],
      compare: compareCloudWatchEvent({
        filterTarget: () => pipe([defaultsDeep({ EventBusName: "default" })]),
        filterLive: () => pipe([omit(["Arn", "CreatedBy"])]),
      }),
      filterLive: ({ lives }) => pipe([omit(["Name", "Arn", "EventBusName"])]),
      dependencies: {
        eventBus: { type: "EventBus", group: "CloudWatchEvents", parent: true },
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
      omitProperties: ["EventBusName", "Rule"],
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
        rule: { type: "Rule", group: "CloudWatchEvents", parent: true },
        //TODO https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putTargets-property
        logGroup: { type: "LogGroup", group: "CloudWatchLogs" },
        sqsQueue: { type: "Queue", group: "SQS" },
        snsTopic: { type: "Topic", group: "SNS" },
        apiGatewayRest: { type: "RestApi", group: "APIGateway" },
        eventBus: { type: "EventBus", group: "CloudWatchEvents" },
        ecsTask: { type: "Task", group: "ECS" },
        lambdaFunction: { type: "Function", group: "Lambda" },
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
