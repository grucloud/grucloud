const assert = require("assert");
const { pipe, assign, map, omit, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws, isOurMinion } = require("../AwsCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { CloudWatchEventBus } = require("./CloudWatchEventBus");
const { CloudWatchEventRule } = require("./CloudWatchEventRule");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html
const GROUP = "CloudWatchEvents";
const compareCloudWatchEvent = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "EventBus",
      Client: CloudWatchEventBus,
      omitProperties: ["Arn", "Targets"],
      filterLive: () => pipe([pick([])]),
    },
    {
      type: "Rule",
      Client: CloudWatchEventRule,
      omitProperties: ["Name", "Arn", "CreatedBy", "Targets"],
      //propertiesDefault: { EventBusName: "default" },
      compare: compareCloudWatchEvent({
        filterTarget: () => pipe([defaultsDeep({ EventBusName: "default" })]),
        filterLive: () => pipe([omit(["Arn", "CreatedBy", "Targets"])]),
      }),
      filterLive: () =>
        pipe([omit(["Name", "Arn", "EventBusName"]), omitIfEmpty(["Targets"])]),
      dependencies: {
        eventBus: { type: "EventBus", group: "CloudWatchEvents", parent: true },
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
