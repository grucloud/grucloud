const assert = require("assert");
const { pipe, tap, get, assign, pick, reduce } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#tagDeliveryStream-property
exports.tagResource =
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live.DeliveryStreamName);
      }),
      (Tags) => ({ DeliveryStreamName: live.DeliveryStreamName, Tags }),
      endpoint().tagDeliveryStream,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#untagDeliveryStream-property
exports.untagResource =
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live.DeliveryStreamName);
      }),
      (TagKeys) => ({ DeliveryStreamName: live.DeliveryStreamName, TagKeys }),
      endpoint().untagDeliveryStream,
    ]);

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
