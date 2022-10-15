const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#tagResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (Tags) => ({ ResourceArn: buildArn(live), Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#untagResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeyList) => ({ ResourceArn: buildArn(live), TagKeyList }),
      endpoint().untagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listTagsForResource-property
exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        buildArn,
        (ResourceArn) => ({ ResourceArn }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);
