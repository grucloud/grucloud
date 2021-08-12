const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  assign,
  omit,
  tryCatch,
  switchCase,
  pick,
} = require("rubico");
const { defaultsDeep, size } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "DomainName",
});

const { tos } = require("@grucloud/core/tos");
const { buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.domainName");
const findName = get("live.domainName");

exports.DomainName = ({ spec, config }) => {
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Certificate",
      group: "acm",
      ids: [live.certificateArn],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getDomainNames-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        logger.info(`getList domainName`);
      }),
      () => apiGateway().getDomainNames(),
      get("items"),
      (items = []) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList domainName #total: ${total}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getDomainName-property
  const getByName = ({ name: domainName }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${domainName}`);
      }),
      () => ({ domainName }),
      tryCatch(pipe([apiGateway().getDomainName]), (error, params) =>
        pipe([
          tap(() => {
            logger.error(`getDomainName ${JSON.stringify({ params, error })}`);
          }),
          () => error,
          switchCase([
            eq(get("code"), "NotFoundException"),
            () => undefined,
            () => {
              throw error;
            },
          ]),
        ])()
      ),
      tap((result) => {
        logger.debug(`getByName ${domainName} result: ${tos(result)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createDomainName-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create domainName: ${name}`);
        logger.debug(tos(payload));
      }),
      () =>
        retryCall({
          name: `createDomainName: ${name}`,
          fn: () => apiGateway().createDomainName(payload),
          config: { retryCount: 40 * 10, retryDelay: 10e3 },
          shouldRetryOnException: ({ error }) =>
            pipe([
              tap(() => {
                logger.error(
                  `create domainName isExpectedException ${tos(error)}`
                );
              }),
              () => error,
              eq(get("code"), "UnsupportedCertificate"),
            ])(),
        }),

      tap(() => {
        logger.info(`created domainName ${name}`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update domainName: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      apiGateway().updateDomainName,
      tap(() => {
        logger.info(`updated domainName ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteDomainName-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      pick(["domainName"]),
      tap((params) => {
        logger.info(`destroy domainname ${JSON.stringify(params)}`);
        assert(params.domainName);
      }),
      tryCatch(apiGateway().deleteDomainName, (error, params) =>
        pipe([
          tap(() => {
            logger.error(
              `deleteDomainName ${JSON.stringify({ params, error })}`
            );
          }),
          () => error,
          switchCase([
            eq(get("code"), "NotFoundException"),
            () => undefined,
            () => {
              throw error;
            },
          ]),
        ])()
      ),
    ])();

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

const filterTarget = ({ target }) => pipe([() => target, omit(["Tags"])])();
const filterLive = ({ live }) => pipe([() => live, omit(["Tags"])])();

exports.compareDomainName = pipe([
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
      tap((params) => {
        assert(true);
      }),
    ])(),
    liveDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
      tap((params) => {
        assert(true);
      }),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compareDomainName ${tos(diff)}`);
  }),
]);
