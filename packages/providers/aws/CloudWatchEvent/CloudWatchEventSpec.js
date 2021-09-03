const { pipe, assign, map, omit, pick } = require("rubico");
const { isOurMinion } = require("../AwsCommon");
const { compare } = require("@grucloud/core/Common");

const { CloudWatchEventBus } = require("./CloudWatchEventBus");
const { CloudWatchEventRule } = require("./CloudWatchEventRule");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html
const GROUP = "CloudWatchEvents";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "EventBus",
      Client: CloudWatchEventBus,
      isOurMinion,
      compare: compare({
        filterAll: pipe([omit(["Tags"])]),
      }),
    },
    {
      type: "Rule",
      dependsOn: ["CloudWatchEvents::EventBus"],
      Client: CloudWatchEventRule,
      isOurMinion,
      compare: compare({
        filterAll: pipe([omit(["Tags"])]),
      }),
    },
  ]);
