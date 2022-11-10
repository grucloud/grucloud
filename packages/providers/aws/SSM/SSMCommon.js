const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

const { createTagger } = require("../AwsTagger");

// TODO ResourceType
// exports.Tagger = createTagger({
//   methodTagResource: "addTagsToResource",
//   methodUnTagResource: "removeTagsFromResource",
//   ResourceArn: "resourceArn",
//   TagsKey: "tags",
//   UnTagsKey: "tagKeys",
// });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#addTagsToResource-property
exports.tagResource =
  ({ ResourceType }) =>
  ({ endpoint }) =>
  ({ id, live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (Tags) => ({ ResourceId: live.Name, Tags, ResourceType }),
      endpoint().addTagsToResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#removeTagsFromResource-property
exports.untagResource =
  ({ ResourceType }) =>
  ({ endpoint }) =>
  ({ id, live }) =>
    pipe([
      (TagKeys) => ({ ResourceId: live.Name, TagKeys, ResourceType }),
      endpoint().removeTagsFromResource,
    ]);

exports.assignTags = ({ endpoint, ResourceType }) =>
  assign({
    Tags: pipe([
      ({ Name }) => ({
        ResourceId: Name,
        ResourceType,
      }),
      endpoint().listTagsForResource,
      get("TagList"),
    ]),
  });
