const { pipe, assign, map, omit, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion } = require("../AwsCommon");
const { compare } = require("@grucloud/core/Common");

const { CloudWatchEventBus } = require("./CloudWatchEventBus");
const { CloudWatchEventRule } = require("./CloudWatchEventRule");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html
const GROUP = "CloudWatchEvents";

const filterTargetDefault = pipe([omit(["Tags"])]);
const filterLiveDefault = pipe([omit(["Tags"])]);

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "EventBus",
      Client: CloudWatchEventBus,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([filterTargetDefault]),
        filterLive: pipe([omit(["Arn"]), filterLiveDefault]),
      }),
    },
    {
      type: "Rule",
      dependsOn: ["CloudWatchEvents::EventBus"],
      Client: CloudWatchEventRule,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([
          defaultsDeep({ EventBusName: "default" }),
          filterTargetDefault,
        ]),
        filterLive: pipe([
          omit(["Arn", "CreatedBy", "Targets"]),
          filterLiveDefault,
        ]),
      }),
    },
  ]);
