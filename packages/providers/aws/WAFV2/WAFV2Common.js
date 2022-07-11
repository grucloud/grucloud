const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#tagResource-property
exports.tagResource =
  ({ findId }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(findId({ live }));
      }),
      (Tags) => ({ ResourceARN: findId({ live }), Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WAFV2.html#untagResource-property
exports.untagResource =
  ({ findId }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(findId({ live }));
      }),
      (TagKeys) => ({ ResourceARN: findId({ live }), TagKeys }),
      endpoint().untagResource,
    ]);

exports.assignTags = ({ findId, endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        (live) => ({ live }),
        findId,
        (ResourceArn) => ({ ResourceArn }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);
