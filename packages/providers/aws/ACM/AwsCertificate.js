const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { first, defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, findNamespaceInTags } = require("../AwsCommon");
const { AwsClient, createAwsResource } = require("../AwsClient");
const { createACM, tagResource, untagResource } = require("./ACMCommon");

const model = {
  pickIds: ["CertificateArn"],
  ignoreErrorCodes: ["ResourceNotFoundException"],
  getById: { method: "describeCertificate", getField: "Certificate" },
  getList: { method: "listCertificates", getParam: "CertificateSummaryList" },
  create: { method: "requestCertificate" },
  destroy: { method: "deleteCertificate" },
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html
exports.AwsCertificate = ({ spec, config }) => {
  const acm = createACM(config);
  const client = AwsClient({ spec, config })(acm);

  return createAwsResource({ spec, client, model })({
    findName: get("live.DomainName"),
    findId: get("live.CertificateArn"),
    decorate: ({}) =>
      assign({
        Tags: pipe([
          pick(["CertificateArn"]),
          acm().listTagsForCertificate,
          get("Tags"),
        ]),
      }),
    isInstanceUp: pipe([
      get("DomainValidationOptions"),
      first,
      get("ResourceRecord"),
    ]),
    getByName: getByNameCore,
    cannotBeDeleted: () => true,
    tagResource: tagResource({ acm }),
    untagResource: untagResource({ acm }),
    findNamespace: findNamespaceInTags(config),
    configDefault: ({
      name,
      namespace,
      properties: { Tags, ...otherProps },
      dependencies,
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          DomainName: name,
          ValidationMethod: "DNS",
          Tags: buildTags({ name, namespace, config, UserTags: Tags }),
        }),
      ])(),
  });
};
