const { pipe, get } = require("rubico");
const { isEmpty, unless } = require("rubico/x");
const { CloudWatchEvents } = require("@aws-sdk/client-cloudwatch-events");
const { createEndpoint } = require("../AwsCommon");

exports.createCloudWatchEvents = createEndpoint(CloudWatchEvents);

exports.ignoreErrorCodes = ["ResourceNotFoundException"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#tagResource-property
exports.tagResource = ({ cloudWatchEvents, diff, id }) =>
  pipe([
    () => diff,
    get("tags.targetTags"),
    (Tags) => ({ ResourceARN: id, Tags }),
    cloudWatchEvents().tagResource,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#untagResource-property
exports.untagResource = ({ cloudWatchEvents, diff, id }) =>
  pipe([
    () => diff,
    get("tags.removedKeys"),
    unless(
      isEmpty,
      pipe([
        (TagKeys) => ({ ResourceARN: id, TagKeys }),
        cloudWatchEvents().untagResource,
      ])
    ),
  ]);
