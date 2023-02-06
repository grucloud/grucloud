const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { find } = require("rubico/x");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceId",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.dependencyIdFileSystem =
  ({ lives, config }) =>
  (live) =>
    pipe([
      lives.getByType({
        type: "FileSystem",
        group: "EFS",
        providerName: config.providerName,
      }),
      find(eq(get("live.FileSystemId"), live.FileSystemId)),
      get("id"),
    ])();

exports.ignoreErrorCodes = ["FileSystemNotFound"];
