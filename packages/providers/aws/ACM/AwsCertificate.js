const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  assign,
  eq,
  pick,
} = require("rubico");
const { first, defaultsDeep, size } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "CertificateManager",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore, isUpByIdCore } = require("@grucloud/core/Common");
const {
  ACMNew,
  buildTags,
  findNamespaceInTags,
  shouldRetryOnException,
} = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findName = get("live.DomainName");
const findId = get("live.CertificateArn");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html
exports.AwsCertificate = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const acm = ACMNew(config);

  const findDependencies = ({ live, lives }) => [];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#listCertificates-property
  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList certificate ${tos(params)}`);
      }),
      () => acm().listCertificates(params),
      get("CertificateSummaryList"),
      map(({ CertificateArn }) =>
        pipe([
          () =>
            acm().describeCertificate({
              CertificateArn,
            }),
          get("Certificate"),
          assign({
            Tags: pipe([
              () =>
                acm().listTagsForCertificate({
                  CertificateArn,
                }),
              get("Tags"),
            ]),
          }),
        ])()
      ),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#getCertificate-property
  const getById = ({ id }) =>
    pipe([
      tap(() => {
        logger.info(`getById ${id}`);
      }),
      tryCatch(
        pipe([
          () => acm().describeCertificate({ CertificateArn: id }),
          get("Certificate"),
        ]),
        switchCase([
          eq(get("code"), "ResourceNotFoundException"),
          () => {
            logger.debug(`getById ${id} ResourceNotFoundException`);
          },
          (error) => {
            logger.debug(`getById error: ${id}, ${tos(error)}`);
            throw Error(error.message);
          },
        ])
      ),
      tap((result) => {
        logger.debug(`getById result: ${tos(result)}`);
      }),
    ])();

  const isInstanceUp = pipe([
    get("DomainValidationOptions"),
    first,
    get("ResourceRecord"),
  ]);

  const isUpById = isUpByIdCore({ isInstanceUp, getById });
  //const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#requestCertificate-property
  const create = async ({ name, payload = {} }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create certificate: ${name}`);
        logger.debug(`${name} => ${tos(payload)}`);
      }),
      () => acm().requestCertificate(payload),
      tap(({ CertificateArn }) => {
        logger.debug(
          `created certificate: ${name}, result: ${tos(CertificateArn)}`
        );
      }),
      ({ CertificateArn }) =>
        retryCall({
          name: `certificate isUpById: ${name} id: ${CertificateArn}`,
          fn: () => isUpById({ name, id: CertificateArn }),
        }),
      tap(({ CertificateArn }) => {
        logger.info(`created CertificateArn: ${CertificateArn}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#deleteCertificate-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      pick(["CertificateArn"]),
      tryCatch(
        acm().deleteCertificate,
        switchCase([
          eq(get("code"), "ResourceNotFoundException"),
          () => null,
          (error) => {
            throw error;
          },
        ])
      ),
    ])();

  const configDefault = async ({
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
    type: "Certificate",
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
    shouldRetryOnException,
    cannotBeDeleted: () => true,
  };
};
