const assert = require("assert");
const { pipe, tap, assign, get, tryCatch } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "Resource",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaStore.html#listTagsForResource-property
exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpointConfig);
    }),
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (Resource) => ({ Resource }),
          endpoint().listTagsForResource,
          get("Tags"),
        ]),
        (error) =>
          pipe([
            tap((params) => {
              assert(error);
            }),
            () => [],
          ])()
      ),
    }),
  ]);
