const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { unless, isEmpty } = require("rubico/x");
const { SQS } = require("@aws-sdk/client-sqs");
const { createEndpoint } = require("../AwsCommon");

exports.createSQS = createEndpoint(SQS);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#tagQueue-property
exports.tagResource = ({ sqs, diff }) =>
  pipe([
    () => diff,
    get("tags.targetTags"),
    (Tags) => ({ QueueUrl: diff.liveIn.QueueUrl, Tags }),
    sqs().tagQueue,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#untagQueue-property
exports.untagResource = ({ sqs, diff }) =>
  pipe([
    () => diff,
    get("tags.removedKeys"),
    unless(
      isEmpty,
      pipe([
        (TagKeys) => ({ QueueUrl: diff.liveIn.QueueUrl, TagKeys }),
        sqs().untagQueue,
      ])
    ),
  ]);
