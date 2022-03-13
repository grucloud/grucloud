const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { first, defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, findNamespaceInTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createACM, tagResource, untagResource } = require("./ACMCommon");

const ignoreErrorCodes = ["ResourceNotFoundException"];

const findName = get("live.DomainName");
const findId = get("live.CertificateArn");
const pickId = pipe([
  tap(({ CertificateArn }) => {
    assert(CertificateArn);
  }),
  pick(["CertificateArn"]),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html
exports.AwsCertificate = ({ spec, config }) => {
  const acm = createACM(config);
  const client = AwsClient({ spec, config })(acm);

  const decorate = () =>
    assign({
      Tags: pipe([pickId, acm().listTagsForCertificate, get("Tags")]),
    });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#getCertificate-property
  const getById = client.getById({
    pickId,
    method: "describeCertificate",
    getField: "Certificate",
    ignoreErrorCodes,
    decorate,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#listCertificates-property
  const getList = client.getList({
    method: "listCertificates",
    getParam: "CertificateSummaryList",
    decorate: () => getById,
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#requestCertificate-property
  const create = client.create({
    method: "requestCertificate",
    getById,
    isInstanceUp: pipe([
      get("DomainValidationOptions"),
      first,
      get("ResourceRecord"),
    ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#deleteCertificate-property
  const destroy = client.destroy({
    pickId,
    method: "deleteCertificate",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
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
    ])();

  return {
    spec,
    getById,
    findId,
    findNamespace: findNamespaceInTags(config),
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    cannotBeDeleted: () => true,
    tagResource: tagResource({ acm }),
    untagResource: untagResource({ acm }),
  };
};
