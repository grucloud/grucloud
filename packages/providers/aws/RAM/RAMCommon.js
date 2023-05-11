const assert = require("assert");
const { pipe, tap, get, not, eq } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceShareArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.managedByOtherAccount = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
      assert(config.accountId());
    }),
    not(eq(get("owningAccountId"), config.accountId())),
  ]);
