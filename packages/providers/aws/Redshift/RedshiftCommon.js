const assert = require("assert");
const { pipe, tap } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#createTags-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (Tags) => ({ ResourceName: buildArn(live), Tags }),
      endpoint().createTags,
    ]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Redshift.html#deleteTags-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ResourceName: buildArn(live), TagKeys }),
      endpoint().deleteTags,
    ]);
