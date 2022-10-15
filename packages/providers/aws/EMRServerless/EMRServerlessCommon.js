const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#tagResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (tags) => ({ resourceArn: buildArn(live), tags }),
      endpoint().tagResource,
    ]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#untagResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (tagKeys) => ({ resourceArn: buildArn(live), tagKeys }),
      endpoint().untagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRServerless.html#listTagsForResource-property
exports.assignTags = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        ({ ARN }) => ({ resourceArn: ARN }),
        endpoint().listTagsForResource,
        get("tags"),
      ]),
    }),
  ]);
