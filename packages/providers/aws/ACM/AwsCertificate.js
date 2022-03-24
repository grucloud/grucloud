const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { first, defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, findNamespaceInTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");
const { tagResource, untagResource } = require("./ACMCommon");

const model = {
  package: "acm",
  client: "ACM",
  pickIds: ["CertificateArn"],
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: { method: "describeCertificate", getField: "Certificate" },
  getList: { method: "listCertificates", getParam: "CertificateSummaryList" },
  create: { method: "requestCertificate" },
  destroy: { method: "deleteCertificate" },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html
exports.AwsCertificate = ({ spec, config }) =>
  createAwsResource({
    model,
    config,
    spec,
    findName: get("live.DomainName"),
    findId: get("live.CertificateArn"),
    pickId: pick(["CertificateArn"]),
    decorate: ({ endpoint }) =>
      pipe([
        assign({
          Tags: pipe([
            pick(["CertificateArn"]),
            endpoint().listTagsForCertificate,
            get("Tags"),
          ]),
        }),
      ]),
    isInstanceUp: pipe([
      get("DomainValidationOptions"),
      first,
      get("ResourceRecord"),
    ]),
    getByName: getByNameCore,
    cannotBeDeleted: () => true,
    tagResource,
    untagResource,
    findNamespace: findNamespaceInTags(config),
    configDefault: ({ name, namespace, properties: { Tags, ...otherProps } }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          DomainName: name,
          ValidationMethod: "DNS",
          Tags: buildTags({ name, namespace, config, UserTags: Tags }),
        }),
      ])(),
  });
