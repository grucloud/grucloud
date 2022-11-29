const assert = require("assert");
const { pipe, map, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { SNSTopic } = require("./SNSTopic");
const { SNSSubscription } = require("./SNSSubscription");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html
const GROUP = "SNS";

const compare = compareAws({});

module.exports = pipe([
  () => [
    //
    SNSTopic({ compare }),
    SNSSubscription({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
