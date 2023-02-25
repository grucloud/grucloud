const assert = require("assert");
const { pipe, map, tap } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#tagResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ id, live }) =>
    pipe([
      tap((params) => {
        assert(live.KeyId);
      }),
      map(({ Key, Value }) => ({ TagKey: Key, TagValue: Value })),
      (Tags) => ({ KeyId: live.KeyId, Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#untagResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live.KeyId);
      }),
      (TagKeys) => ({ KeyId: live.KeyId, TagKeys }),
      tap((params) => {
        assert(true);
      }),
      endpoint().untagResource,
    ]);
