const assert = require("assert");
const { pipe, tap, assign, get, tryCatch } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "createTags",
  methodUnTagResource: "deleteTags",
  ResourceArn: "ResourceId",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpaces.html#describeTags-property
exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (ResourceId) => ({ ResourceId }),
          endpoint().describeTags,
          get("TagList"),
        ]),
        (error) => []
      ),
    }),
  ]);
