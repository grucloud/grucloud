const assert = require("assert");
const { map, pipe, tap, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "addTagsToCertificate",
  methodUnTagResource: "removeTagsFromCertificate",
  ResourceArn: "CertificateArn",
  TagsKey: "Tags",
  UnTagsKey: "Tags",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#addTagsToCertificate-property
exports.tagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      (Tags) => ({ CertificateArn: id, Tags }),
      endpoint().addTagsToCertificate,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#removeTagsFromCertificate-property
exports.untagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      map((Key) => ({ Key })),
      (Tags) => ({ CertificateArn: id, Tags }),
      endpoint().removeTagsFromCertificate,
    ]);
