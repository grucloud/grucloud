const assert = require("assert");
const { pipe, tap, assign, get, tryCatch } = require("rubico");
const { callProp, last } = require("rubico/x");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "addTags",
  methodUnTagResource: "deleteTags",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (ResourceARN) => ({ ResourceARN }),
          endpoint().listTags,
          get("Tags"),
        ]),
        (error) => []
      ),
    }),
  ]);

exports.ignoreErrorCodes = ["ResourceNotFound"];

exports.arnToId = (service) => pipe([callProp("split", `${service}/`), last]);
