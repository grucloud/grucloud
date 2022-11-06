const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

// TODO
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#addLFTagsToResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (Tags) => ({ ResourceArn: buildArn(live), Tags }),
      endpoint().addLFTagsToResource,
    ]);

//TODO
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#removeLFTagsFromResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: buildArn(live), TagKeys }),
      endpoint().removeLFTagsFromResource,
    ]);
