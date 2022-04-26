const assert = require("assert");
const { pipe, tap, get } = require("rubico");

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
