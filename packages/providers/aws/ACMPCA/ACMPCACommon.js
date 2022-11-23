const assert = require("assert");
const { pipe, tap, get, not, eq } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagCertificateAuthority",
  methodUnTagResource: "untagCertificateAuthority",
  ResourceArn: "CertificateAuthorityArn",
  TagsKey: "Tags",
  UnTagsKey: "Tags",
});

exports.managedByOtherAccount = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
      assert(config.accountId());
    }),
    not(eq(get("SourceAccount"), config.accountId())),
  ]);
