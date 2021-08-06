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
} = require("rubico");
const { pluck, defaultsDeep, size } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "DomainName",
});

const { tos } = require("@grucloud/core/tos");
const { buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.DomainName");
const findName = get("live.DomainName");

exports.DomainName = ({ spec, config }) => {
  const apiGateway = () =>
    createEndpoint({ endpointName: "ApiGatewayV2" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Certificate",
      group: "acm",
      ids: pipe([
        () => live,
        get("DomainNameConfigurations"),
        pluck("CertificateArn"),
        tap((params) => {
          assert(true);
        }),
      ])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getDomainNames-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        logger.info(`getList domainName`);
      }),
      () => apiGateway().getDomainNames(),
      get("Items"),
      (items = []) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList domainName #total: ${total}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getDomainName-property
  const getByName = ({ name: DomainName }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${DomainName}`);
      }),
      tryCatch(
        pipe([
          () => apiGateway().getDomainName({ DomainName }),
          tap((params) => {
            assert(true);
          }),
        ]),
        switchCase([
          eq(get("code"), "ResourceNotFoundException"),
          () => {
            logger.debug(`getByName ${DomainName} ResourceNotFoundException`);
          },
          (error) => {
            logger.error(`getByName error: ${tos(error)}`);
            throw Error(error.message);
          },
        ])
      ),
      tap((result) => {
        logger.debug(`getByName ${DomainName} result: ${tos(result)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createDomainName-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create domainName: ${name}`);
        logger.debug(tos(payload));
      }),
      () =>
        retryCall({
          name: `elb listener: ${name}`,
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteDomainName-property
  const destroy = ({ live }) =>
    pipe([
      () => ({ DomainName: findName({ live }) }),
      tap((params) => {
        logger.info(`destroy domainName ${JSON.stringify(params)}`);
      }),
      tap(apiGateway().deleteDomainName),
      tap((params) => {
        logger.debug(`destroyed domainName ${JSON.stringify(params)}`);
      }),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { certificate },
  }) =>
    pipe([
      tap(() => {
        assert(certificate, "missing 'certificate' dependency");
      }),
      () => properties,
      defaultsDeep({
        DomainName: name,
        DomainNameConfigurations: [
          {
            CertificateArn: getField(certificate, "CertificateArn"),
          },
        ],
        Tags: buildTagsObject({ config, namespace, name }),
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
