const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  and,
  filter,
  assign,
  eq,
  not,
} = require("rubico");
const {
  first,
  defaultsDeep,
  isEmpty,
  find,
  pluck,
  flatten,
  size,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "CertificateManager",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const {
  ACMNew,
  buildTags,
  findNameInTags,
  findNamespaceInTags,
  shouldRetryOnException,
} = require("../AwsCommon");

const findName = findNameInTags;

const findId = get("live.CertificateArn");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html
exports.AwsCertificate = ({ spec, config }) => {
  const acm = ACMNew(config);

  const findDependencies = ({ live, lives }) => [];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#listCertificates-property
  const getList = async ({ params } = {}) =>
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

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACM.html#getCertificate-property
  const getById = pipe([
    tap(({ id }) => {
      logger.info(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) =>
        pipe([
          () => acm().describeCertificate({ CertificateArn: id }),
          get("Certificate"),
        ])(),
      switchCase([
        eq(get("code"), "ResourceNotFoundException"),
        (error, { id }) => {
          logger.debug(`getById ${id} ResourceNotFoundException`);
        },
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw Error(error.message);
        },
      ])
    ),
    tap((result) => {
      logger.debug(`getById result: ${tos(result)}`);
    }),
  ]);

  const isInstanceUp = pipe([
    get("DomainValidationOptions"),
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
  const destroy = async ({ live, lives }) =>
    pipe([
      () => ({ id: findId({ live, lives }), name: findName({ live, lives }) }),
      ({ id, name }) =>
        pipe([
          tap(() => {
            logger.info(`destroy ${JSON.stringify({ name, id })}`);
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
            logger.info(
              `certificate destroyed ${JSON.stringify({ name, id })}`
            );
          }),
        ])(),
    ])();

  const configDefault = async ({
    name,
    namespace,
    payload,
    properties,
    dependencies,
  }) =>
    defaultsDeep({
      DomainName: name,
      ValidationMethod: "DNS",
      Tags: buildTags({ name, namespace, config, UserTags: payload?.Tags }),
    })(properties);

  return {
    type: "Certificate",
    spec,
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
