const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "updateTagsForResource",
  methodUnTagResource: "updateTagsForResource",
  ResourceArn: "ResourceArn",
  TagsKey: "TagsToAdd",
  UnTagsKey: "TagsToRemove",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticBeanstalk.html#updateTagsForResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (TagsToAdd) => ({ ResourceArn: buildArn(live), TagsToAdd }),
      endpoint().updateTagsForResource,
    ]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticBeanstalk.html#updateTagsForResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagsToRemove) => ({ ResourceArn: buildArn(live), TagsToRemove }),
      endpoint().updateTagsForResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticBeanstalk.html#listTagsForResource-property
exports.assignTags = ({ endpoint, buildArn }) =>
  pipe([
    assign({
      Tags: pipe([
        buildArn,
        (ResourceArn) => ({ ResourceArn }),
        endpoint().listTagsForResource,
        get("TagList"),
      ]),
    }),
  ]);
