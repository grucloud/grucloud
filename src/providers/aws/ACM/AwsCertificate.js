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
const { retryExpectOk } = require("../../Retry");
const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const { buildTags, findNameInTags } = require("../AwsCommon");

const findName = findNameInTags;

const findId = (item) => {
  assert(item);
  const id = item.CertificateArn;
  assert(id);
  return id;
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsCertificate = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const acm = new AWS.ACM();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#listCertificates-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList ${tos(params)}`);
      }),
      () => acm.listCertificates(params).promise(),
      get("CertificateSummaryList"),
      tap((xxx) => {
        //logger.debug(`getList ${tos(xxx)}`);
      }),
      map(async (certificate) => ({
        ...certificate,
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
        logger.debug(`getList certificates result: ${tos(certificates)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#getCertificate-property
  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => acm.getCertificate({ CertificateArn: id }).promise(),
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

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#requestCertificate-property
  const create = async ({ name, payload = {} }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create certificate: ${name}, ${tos(payload)}`);
      }),
      () => acm.requestCertificate(payload).promise(),
      tap(({ CertificateArn }) => {
        logger.debug(
          `created certificate: ${name}, result: ${tos(CertificateArn)}`
        );
      }),
      tap(({ CertificateArn }) =>
        acm
          .addTagsToCertificate({
            CertificateArn,
            Tags: buildTags({ name, config }),
          })
          .promise()
      ),

      tap(({ CertificateArn }) => {
        logger.debug(`created done`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#deleteCertificate-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy ${tos({ name, id })}`);
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
        logger.debug(`destroy done, ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) => {
    return defaultsDeep({ DomainName: name })(properties);
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
