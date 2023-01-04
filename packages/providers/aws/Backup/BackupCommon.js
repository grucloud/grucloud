const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");
const { callProp } = require("rubico/x");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeyList",
});

exports.managedByEFS = pipe([
  get("CreatorRequestId", "x"),
  callProp("startsWith", "aws/efs/automatic-backup"),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#tagResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (Tags) => ({ ResourceArn: buildArn(live), Tags }),
      endpoint().tagResource,
    ]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#untagResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeyList) => ({ ResourceArn: buildArn(live), TagKeyList }),
      endpoint().untagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Backup.html#listTags-property
exports.assignTags = ({ endpoint, buildArn }) =>
  pipe([
    assign({
      Tags: pipe([
        buildArn,
        (ResourceArn) => ({ ResourceArn }),
        endpoint().listTags,
        get("Tags"),
      ]),
    }),
  ]);
