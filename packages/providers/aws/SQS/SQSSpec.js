const assert = require("assert");
const { pipe, assign, map, omit, tap, get } = require("rubico");
const { compare } = require("@grucloud/core/Common");

const { isOurMinionFactory, isOurMinion } = require("../AwsCommon");
const { SQSQueue } = require("./SQSQueue");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
const GROUP = "SQS";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Queue",
      Client: SQSQueue,
      isOurMinion,
      compare: compare({
        filterAll: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      }),
    },
  ]);
