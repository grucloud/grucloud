const assert = require("assert");
const { pipe, tap, get, assign, pick, reduce } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#addTagsToStream-property
exports.tagResource =
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live.StreamName);
      }),
      reduce((acc, elem) => ({ ...acc, [elem.Key]: elem.Value }), {}),
      (Tags) => ({ StreamName: live.StreamName, Tags }),
      endpoint().addTagsToStream,
    ]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#removeTagsFromStream-property
exports.untagResource =
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live.StreamName);
      }),
      (TagKeys) => ({ StreamName: live.StreamName, TagKeys }),
      endpoint().removeTagsFromStream,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#listTagsForStream-property
exports.assignTags = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        pick(["StreamName"]),
        endpoint().listTagsForStream,
        get("Tags"),
      ]),
    }),
  ]);
