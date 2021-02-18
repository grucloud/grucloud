const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  pick,
  filter,
  eq,
} = require("rubico");
const {
  first,
  defaultsDeep,
  isEmpty,
  forEach,
  pluck,
  flatten,
} = require("rubico/x");

const logger = require("../../../logger")({ prefix: "CertificateManager" });
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const {
  ACMNew,
  buildTags,
  findNameInTags,
  shouldRetryOnException,
} = require("../AwsCommon");

const findName = findNameInTags;

const findId = get("CertificateArn");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html
exports.AwsCertificate = ({ spec, config }) => {
  const acm = ACMNew();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#listCertificates-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList certificate ${tos(params)}`);
      }),
      () => acm().listCertificates(params),
      get("CertificateSummaryList"),
      map(async ({ CertificateArn }) => ({
        ...(await pipe([
          () =>
            acm().describeCertificate({
              CertificateArn,
            }),
          get("Certificate"),
        ])()),
        Tags: await pipe([
          () =>
            acm().listTagsForCertificate({
              CertificateArn,
            }),
          get("Tags"),
        ])(),
      })),
      tap((certificates) => {
        logger.debug(`getList certificates result: ${tos(certificates)}`);
      }),
      (certificates) => ({
        total: certificates.length,
        items: certificates,
      }),
      tap(({ total }) => {
        logger.info(`getList #certificates : ${total}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#getCertificate-property
  const getById = pipe([
    tap(({ id }) => {
      logger.info(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => acm().describeCertificate({ CertificateArn: id }),
      switchCase([
        eq(get("code"), "ResourceNotFoundException"),
        (error, { id }) => {
          logger.debug(`getById ${id} ResourceNotFoundException`);
        },
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw error;
        },
      ])
    ),
    tap((result) => {
      logger.debug(`getById result: ${tos(result)}`);
    }),
  ]);

  const isInstanceUp = pipe([
    get("Certificate.DomainValidationOptions"),
    first,
    get("ResourceRecord"),
  ]);

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
      (params) => acm().requestCertificate(params),
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
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy ${JSON.stringify({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () =>
        acm().deleteCertificate({
          CertificateArn: id,
        }),
      tap(() =>
        retryCall({
          name: `certificate destroy isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id, name }),
          config,
        })
      ),
      tap(() => {
        logger.info(`certificate destroyed ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      DomainName: name,
      ValidationMethod: "DNS",
      Tags: [],
    })(properties);

  return {
    type: "Certificate",
    spec,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
    cannotBeDeleted: () => true,
  };
};
