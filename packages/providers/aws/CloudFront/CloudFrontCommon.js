const { pipe, get } = require("rubico");
const { createEndpoint } = require("../AwsCommon");

const { createTagger } = require("../AwsTagger");

exports.createCloudFront = createEndpoint("cloudfront", "CloudFront");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "Resource",
  TagsKey: "Tags",
  UnTagsKey: "TagKeyList",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#tagResource-property
exports.tagResource =
  ({ cloudFront }) =>
  ({ id }) =>
    pipe([
      (Items) => ({ Resource: id, Tags: { Items } }),
      cloudFront().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#untagResource-property
exports.untagResource =
  ({ cloudFront }) =>
  ({ id }) =>
    pipe([
      (Items) => ({ Resource: id, TagKeys: { Items } }),
      cloudFront().untagResource,
    ]);
