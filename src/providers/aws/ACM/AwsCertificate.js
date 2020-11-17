const assert = require("assert");
const AWS = require("aws-sdk");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  pick,
  filter,
} = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck, flatten } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "CertificateManager" });
const { retryExpectOk, retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const { buildTags, findNameInTags } = require("../AwsCommon");

const findName = findNameInTags;

const findId = get("CertificateArn");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html
exports.AwsCertificate = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const acm = new AWS.ACM();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#listCertificates-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList certificate ${tos(params)}`);
      }),
      () => acm.listCertificates(params).promise(),
      get("CertificateSummaryList"),
      map(async (certificate) => ({
        ...(await pipe([
          () =>
            acm
              .describeCertificate({
                CertificateArn: certificate.CertificateArn,
              })
              .promise(),
          get("Certificate"),
        ])()),
        Tags: await pipe([
          () =>
            acm
              .listTagsForCertificate({
                CertificateArn: certificate.CertificateArn,
              })
              .promise(),
          get("Tags"),
        ])(),
      })),
      (certificates) => ({
        total: certificates.length,
        items: certificates,
      }),
      tap((certificates) => {
        logger.info(`getList #certificates : ${certificates.length}`);
        logger.debug(`getList certificates result: ${tos(certificates)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#getCertificate-property
  const getById = pipe([
    tap(({ id }) => {
      logger.info(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => acm.describeCertificate({ CertificateArn: id }).promise(),
      switchCase([
        (error) => error.code !== "ResourceNotFoundException",
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw error;
        },
        (error, { id }) => {
          logger.debug(`getById ${id} ResourceNotFoundException`);
        },
      ])
    ),
    tap((result) => {
      logger.debug(`getById result: ${tos(result)}`);
    }),
  ]);

  const isInstanceUp = (instance) => {
    return instance.Certificate?.DomainValidationOptions[0].ResourceRecord;
  };

  const isUpById = isUpByIdCore({ isInstanceUp, getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#requestCertificate-property
  const create = async ({ name, payload = {} }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create certificate: ${name}, ${tos(payload)}`);
      }),
      () => ({
        ...payload,
        Tags: [...payload.Tags, ...buildTags({ name, config })],
      }),
      tap((params) => {
        logger.debug(`create certificate: ${name}, params: ${tos(params)}`);
      }),
      (params) => acm.requestCertificate(params).promise(),
      tap(({ CertificateArn }) => {
        logger.debug(
          `created certificate: ${name}, result: ${tos(CertificateArn)}`
        );
      }),
      ({ CertificateArn }) =>
        retryCall({
          name: `certificate isUpById: ${name} id: ${CertificateArn}`,
          fn: () => isUpById({ name, id: CertificateArn }),
          isExpectedResult: (result) => result,
        }),
      tap(({ CertificateArn }) => {
        logger.info(`created CertificateArn: ${CertificateArn}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#deleteCertificate-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () =>
        acm
          .deleteCertificate({
            CertificateArn: id,
          })
          .promise(),
      tap(() =>
        retryExpectOk({
          name: `isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`certificate destroyed ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) => {
    return defaultsDeep({
      DomainName: name,
      ValidationMethod: "DNS",
      Tags: [],
    })(properties);
  };

  return {
    type: "Certificate",
    spec,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    cannotBeDeleted: () => false,
    findName,
    create,
    destroy,
    getList,
    configDefault,
  };
};
