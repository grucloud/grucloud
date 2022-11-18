const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagCertificateAuthority",
  methodUnTagResource: "untagResource",
  ResourceArn: "CertificateAuthorityArn",
  TagsKey: "Tags",
  UnTagsKey: "Tags",
});
