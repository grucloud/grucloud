const assert = require("assert");
const { pipe, tap, get, assign, pick } = require("rubico");
const { first, defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags, findNamespaceInTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createACM } = require("./ACMCommon");

const ignoreErrorCodes = ["ResourceNotFoundException"];

const findName = get("live.DomainName");
const findId = get("live.CertificateArn");
const pickId = pick(["CertificateArn"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html
exports.AwsCertificate = ({ spec, config }) => {
  const acm = createACM(config);
  const client = AwsClient({ spec, config })(acm);

  const findDependencies = ({ live, lives }) => [];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#getCertificate-property
  const getById = client.getById({
    pickId,
    method: "describeCertificate",
    getField: "Certificate",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#listCertificates-property
  const getList = client.getList({
    method: "listCertificates",
    getParam: "CertificateSummaryList",
    decorate:
      () =>
      ({ CertificateArn }) =>
        pipe([
          tap(() => {
            assert(CertificateArn);
          }),
          () => ({
            CertificateArn,
          }),
          getById,
          assign({
            Tags: pipe([
              () =>
                acm().listTagsForCertificate({
                  CertificateArn,
                }),
              get("Tags"),
            ]),
          }),
        ])(),
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
    defaultsDeep({
      DomainName: name,
      ValidationMethod: "DNS",
      Tags: buildTags({ name, namespace, config, UserTags: Tags }),
    })(otherProps);

  return {
    spec,
    getById,
    findId,
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    cannotBeDeleted: () => true,
  };
};
