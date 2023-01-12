const { pipe, get } = require("rubico");
const { createEndpoint } = require("../AwsCommon");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceARN",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.createCloudWatchEvents = createEndpoint(
  "cloudwatch-events",
  "CloudWatchEvents"
);

exports.ignoreErrorCodes = ["ResourceNotFoundException"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#tagResource-property
exports.tagResource =
  ({ cloudWatchEvents }) =>
  ({ live, id }) =>
    pipe([
      (Tags) => ({ ResourceARN: id, Tags }),
      cloudWatchEvents().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#untagResource-property
exports.untagResource =
  ({ cloudWatchEvents }) =>
  ({ live, id }) =>
    pipe([
      (TagKeys) => ({ ResourceARN: id, TagKeys }),
      cloudWatchEvents().untagResource,
    ]);
