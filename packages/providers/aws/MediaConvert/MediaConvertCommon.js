const assert = require("assert");
const { pipe, tap, assign, get, tryCatch } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "Arn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#listTagsForResource-property
exports.assignTags = ({ buildArn, endpoint, endpointConfig }) =>
  pipe([
    tap((params) => {
      assert(endpointConfig);
    }),
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (Arn) => ({ Arn }),
          endpoint(endpointConfig).listTagsForResource,
          get("ResourceTags.Tags"),
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
