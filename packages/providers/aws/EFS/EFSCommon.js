const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");
const { find } = require("rubico/x");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html#tagResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([(Tags) => ({ ResourceId: id, Tags }), endpoint().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html#untagResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      (TagKeys) => ({ ResourceId: id, TagKeys }),
      endpoint().untagResource,
    ]);

exports.findDependenciesFileSystem = ({ live, lives, config }) =>
  pipe([
    () =>
      lives.getByType({
        type: "FileSystem",
        group: "EFS",
        providerName: config.providerName,
      }),
    find(eq(get("live.FileSystemId"), live.FileSystemId)),
    get("id"),
    (id) => ({ type: "FileSystem", group: "EFS", ids: [id] }),
  ])();
