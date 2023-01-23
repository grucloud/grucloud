const assert = require("assert");
const { tap, pipe, map, omit, get } = require("rubico");
const { defaultsDeep, unless, callProp } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws, isOurMinion } = require("../AwsCommon");

const { CloudWatchEventConnection } = require("./CloudWatchEventConnection");
const { CloudWatchEventBus } = require("./CloudWatchEventBus");
const { CloudWatchEventRule } = require("./CloudWatchEventRule");
const { CloudWatchEventTarget } = require("./CloudWatchEventTarget");
const {
  CloudWatchEventApiDestination,
} = require("./CloudWatchEventApiDestination");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html
const GROUP = "CloudWatchEvents";
const compare = compareAws({});

module.exports = pipe([
  () => [
    CloudWatchEventApiDestination({ compare }),
    CloudWatchEventConnection({ compare }),
    CloudWatchEventBus({ compare }),
    CloudWatchEventRule({ compare }),
    CloudWatchEventTarget({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        isOurMinion,
      }),
    ])
  ),
]);
