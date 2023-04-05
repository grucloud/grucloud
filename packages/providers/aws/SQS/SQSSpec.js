const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { SQSQueue } = require("./SQSQueue");
const { SQSQueueRedriveAllowPolicy } = require("./SQSQueueRedriveAllowPolicy");

const { SQSQueueRedrivePolicy } = require("./SQSQueueRedrivePolicy");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
const GROUP = "SQS";
const tagsKey = "tags";

const compareSQS = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    SQSQueue({}),
    SQSQueueRedriveAllowPolicy({}),
    SQSQueueRedrivePolicy({}),
  ],

  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compareSQS({}),
      }),
    ])
  ),
]);
