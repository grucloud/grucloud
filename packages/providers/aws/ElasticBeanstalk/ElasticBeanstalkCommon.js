const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

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
exports.assignTags = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        ({ ARN }) => ({ ResourceArn: ARN }),
        endpoint().listTagsForResource,
        get("TagList"),
      ]),
    }),
  ]);
