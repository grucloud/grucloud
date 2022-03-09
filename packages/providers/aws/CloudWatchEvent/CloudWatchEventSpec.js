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

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "EventBus",
      Client: CloudWatchEventBus,
      isOurMinion,
      compare: compareCloudWatchEvent({
        filterLive: () => pipe([omit(["Arn"])]),
      }),
      filterLive: () => pipe([pick([])]),
    },
    {
      type: "Rule",
      Client: CloudWatchEventRule,
      isOurMinion,
      compare: compareCloudWatchEvent({
        filterTarget: () =>
          pipe([
            defaultsDeep({ EventBusName: "default" }),
            filterTargetDefault,
          ]),
        filterLive: () =>
          pipe([omit(["Arn", "CreatedBy", "Targets"]), filterLiveDefault]),
      }),
      filterLive: () =>
        pipe([omit(["Name", "Arn", "EventBusName"]), omitIfEmpty(["Targets"])]),
      dependencies: {
        eventBus: { type: "EventBus", group: "CloudWatchEvents", parent: true },
      },
    },
  ]);
