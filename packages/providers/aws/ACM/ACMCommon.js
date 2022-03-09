const assert = require("assert");
const { map, pipe, tap, get } = require("rubico");
const { ACM } = require("@aws-sdk/client-acm");

const { createEndpoint } = require("../AwsCommon");

exports.createACM = createEndpoint(ACM);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#addTagsToCertificate-property
exports.tagResource =
  ({ acm }) =>
  ({ id }) =>
    pipe([
      (Tags) => ({ CertificateArn: id, Tags }),
      acm().addTagsToCertificate,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#removeTagsFromCertificate-property
exports.untagResource =
  ({ acm }) =>
  ({ id }) =>
    pipe([
      map((Key) => ({ Key })),
      (Tags) => ({ CertificateArn: id, Tags }),
      acm().removeTagsFromCertificate,
    ]);
