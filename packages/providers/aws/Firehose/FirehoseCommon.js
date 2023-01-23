const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagDeliveryStream",
  methodUnTagResource: "untagDeliveryStream",
  ResourceArn: "DeliveryStreamName",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#listTagsForDeliveryStream-property
exports.assignTags = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        pick(["DeliveryStreamName"]),
        endpoint().listTagsForDeliveryStream,
        get("Tags"),
      ]),
    }),
  ]);
