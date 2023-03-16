const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tag",
  methodUnTagResource: "untag",
  ResourceArn: "Arn",
  TagsKey: "Tags",
  UnTagsKey: "Keys",
});

exports.assignTags = ({ endpoint, buildArn }) =>
  pipe([
    assign({
      Tags: pipe([
        tap((Arn) => {
          assert(Arn);
        }),
        buildArn(),
        tap((Arn) => {
          assert(Arn);
        }),
        (Arn) => ({ Arn }),
        endpoint().getTags,
        get("Tags"),
      ]),
    }),
  ]);
