const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "Tags",
  UnTagsKey: "tagKeys",
});

exports.assignTags = ({ endpoint, buildArn }) =>
  pipe([
    assign({
      Tags: pipe([
        buildArn,
        tap((resourceArn) => {
          assert(resourceArn);
        }),
        (resourceArn) => ({ resourceArn }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);
