const assert = require("assert");
const { map, pipe, tap, get } = require("rubico");
const { isEmpty, unless } = require("rubico/x");
const { ACM } = require("@aws-sdk/client-acm");

const { createEndpoint } = require("../AwsCommon");

exports.createACM = createEndpoint(ACM);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#addTagsToCertificate-property
const tagResource =
  ({ acm }) =>
  ({ diff, id }) =>
    pipe([
      () => diff,
      get("tags.targetTags"),
      (Tags) => ({ CertificateArn: id, Tags }),
      acm().addTagsToCertificate,
    ]);
exports.tagResource = tagResource;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#removeTagsFromCertificate-property
const untagResource =
  ({ acm }) =>
  ({ diff, id }) =>
    pipe([
      () => diff,
      get("tags.removedKeys"),
      map((Key) => ({ Key })),
      unless(
        isEmpty,
        pipe([
          (Tags) => ({ CertificateArn: id, Tags }),
          acm().removeTagsFromCertificate,
        ])
      ),
    ]);
exports.untagResource = untagResource;
