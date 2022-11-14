const assert = require("assert");
const { pipe, map, omit, tap, get, eq, flatMap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { isOurMinionObject } = require("../AwsCommon");

const { SQSQueue } = require("./SQSQueue");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
const GROUP = "SQS";
const tagsKey = "tags";

const compareSQS = compareAws({ tagsKey });

module.exports = pipe([
  () => [SQSQueue()],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      compare: compareSQS({}),
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.tags, config }),
    })
  ),
]);
