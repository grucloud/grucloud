const assert = require("assert");
const { pipe, tap, get, eq, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "DomainName",
});

const { buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.domainName");
const findName = get("live.domainName");
const pickId = pick(["domainName"]);

exports.DomainName = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Certificate",
      group: "ACM",
      ids: [live.certificateArn],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getDomainName-property
  const getById = client.getById({
    pickId,
    method: "getDomainName",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getDomainNames-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        logger.info(`getList domainName`);
      }),
      () => apiGateway().getDomainNames(),
      get("items"),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getDomainName-property
  const getByName = ({ name: domainName }) => getById({ domainName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createDomainName-property
  const create = client.create({
    method: "createDomainName",
    getById,
    pickId,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateDomainName-property
  const update = client.update({
    pickId,
    method: "updateDomainName",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteAuthorizer-property
  const destroy = client.destroy({
    pickId,
    method: "deleteDomainName",
    getById,
    //TODO
    ignoreError: eq(get("code"), "NotFoundException"),
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { tags, ...otherProp },
    dependencies: { certificate, regionalCertificate },
  }) =>
    pipe([
      tap(() => {
        assert(
          certificate || regionalCertificate,
          "missing 'certificate' or 'regionalCertificate' dependency"
        );
      }),
      () => otherProp,
      defaultsDeep({
        domainName: name,
        ...(certificate && {
          certificateArn: getField(certificate, "CertificateArn"),
        }),
        ...(regionalCertificate && {
          regionalCertificateArn: getField(
            regionalCertificate,
            "CertificateArn"
          ),
        }),
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
      }),
    ])();

  return {
    spec,
    findName,
    findId,
    getById,
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
    shouldRetryOnException,
    findDependencies,
  };
};
