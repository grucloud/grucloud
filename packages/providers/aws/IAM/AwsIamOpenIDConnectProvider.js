const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  assign,
  pick,
  not,
  filter,
} = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck, find } = require("rubico/x");
const tls = require("tls");

const logger = require("@grucloud/core/logger")({
  prefix: "IamOIDC",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  IAMNew,
  buildTags,
  findNameInTagsOrId,
  findNamespaceInTags,
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
} = require("../AwsCommon");
const {
  mapPoolSize,
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const formatThumbPrint = pipe([
  get("fingerprint"),
  (fingerprint) => fingerprint.replace(/:/g, ""),
  (fingerprint) => fingerprint.toLowerCase(),
]);

const getLastCertificate = (certificate) => {
  let list = new Set();
  let certs = [];
  do {
    list.add(certificate);
    certs.push(certificate);
    logger.debug(`issuer: ${JSON.stringify(certificate.issuer)}`);
    logger.debug(`subject: ${JSON.stringify(certificate.subject)}`);
    logger.debug(`fingerprint: ${formatThumbPrint(certificate)}`);
    certificate = certificate.issuerCertificate;
  } while (
    certificate &&
    typeof certificate === "object" &&
    !list.has(certificate)
  );
  const last = certs[certs.length - 2];
  return last;
};
// https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html
const fetchThumbprint = ({ Url }) =>
  pipe([
    tap(() => {
      logger.info(`fetchFingerPrint ${Url}`);
    }),
    () => new URL(Url),
    ({ port, hostname }) => ({
      host: hostname,
      port: port || 443,
      rejectUnauthorized: false,
    }),
    (tlsOptions) =>
      new Promise((resolve, reject) => {
        const tlsStream = tls.connect(tlsOptions, () => {
          resolve(tlsStream.getPeerCertificate(true));
        });
      }),
    tap((peerCertificate) => {
      logger.debug(`peerCertificate `);
    }),
    getLastCertificate,
    formatThumbPrint,
    tap((fingerprint) => {
      logger.debug(`fingerprint ${fingerprint}`);
    }),
  ])();
exports.fetchThumbprint = fetchThumbprint;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamOpenIDConnectProvider = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { providerName } = config;
  const iam = IAMNew(config);

  const findId = get("live.Arn");
  const findName = findNameInTagsOrId({ findId });

  const findDependencies = ({ live, lives }) => [
    {
      type: "Cluster",
      group: "eks",
      ids: [
        pipe([
          () =>
            lives.getByType({
              type: "Cluster",
              group: "eks",
              providerName,
            }),
          find(eq(get("live.identity.oidc.issuer"), `https://${live.Url}`)),
          get("id"),
        ])(),
      ],
    },
  ];

  const findNamespace = (param) =>
    pipe([
      () => [findNamespaceInTags(config)(param)],
      find(not(isEmpty)),
      tap((namespace) => {
        logger.debug(`findNamespace ${namespace}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listOpenIDConnectProviders-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList iam oidc`);
      }),
      () => iam().listOpenIDConnectProviders(params),
      get("OpenIDConnectProviderList"),
      tap((oidcs) => {
        logger.debug(`getList oidcs: ${tos(oidcs)}`);
      }),
      map.pool(
        mapPoolSize,
        tryCatch(
          ({ Arn }) =>
            pipe([
              () =>
                iam().getOpenIDConnectProvider({
                  OpenIDConnectProviderArn: Arn,
                }),
              pick(["ClientIDList", "ThumbprintList", "Url", "CreateDate"]),
              assign({
                Arn: () => Arn,
                Tags: pipe([
                  () =>
                    iam().listOpenIDConnectProviderTags({
                      OpenIDConnectProviderArn: Arn,
                    }),
                  get("Tags"),
                ]),
              }),
            ])(),
          (error, oidc) =>
            pipe([
              tap(() => {
                logger.error(`getList iam oidc error: ${tos({ error, oidc })}`);
              }),
              () => ({ error, oidc }),
            ])()
        )
      ),
      tap.if(find(get("error")), (oidcs) => {
        throw oidcs;
      }),
      tap((oidcs) => {
        logger.debug(`getList iam oidc results: ${tos(oidcs)}`);
      }),
      (oidcs) => ({
        total: oidcs.length,
        items: oidcs,
      }),
      tap(({ total }) => {
        logger.info(`getList #iamoidc: ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#getOpenIDConnectProvider-property
  const getById = ({ id: OpenIDConnectProviderArn }) =>
    pipe([
      tap(() => {
        logger.debug(`getById ${OpenIDConnectProviderArn}`);
      }),
      tryCatch(
        () => iam().getOpenIDConnectProvider({ OpenIDConnectProviderArn }),
        switchCase([
          eq(get("code"), "NoSuchEntity"),
          (error) => {
            logger.debug(`getById ${OpenIDConnectProviderArn} NoSuchEntity`);
          },
          (error) => {
            logger.debug(`getById error: ${tos(error)}`);
            throw error;
          },
        ])
      ),
      tap((result) => {
        logger.debug(`getById result: ${result}`);
      }),
    ])();

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createOpenIDConnectProvider-property
  const create = async ({
    name,
    namespace,
    payload = {},
    resolvedDependencies: {},
  }) =>
    pipe([
      tap(() => {
        logger.info(`create iam oidc ${name}, namespace: ${namespace}`);
        logger.debug(`payload: ${tos(payload)}`);
      }),
      () => fetchThumbprint({ Url: payload.Url }),
      (thumbprint) => defaultsDeep({ ThumbprintList: [thumbprint] })(payload),
      tap((createParams) => {
        logger.debug(`createParams: ${tos(createParams)}`);
      }),
      (createParams) => iam().createOpenIDConnectProvider(createParams),
      tap((result) => {
        logger.debug(`createOpenIDConnectProvider result: ${tos(result)}`);
      }),
      tap(({ OpenIDConnectProviderArn }) =>
        retryCall({
          name: `iam oidc isUpById: ${name} OpenIDConnectProviderArn: ${OpenIDConnectProviderArn}`,
          fn: () => isUpById({ id: OpenIDConnectProviderArn }),
          config,
        })
      ),
      ({ OpenIDConnectProviderArn }) => ({
        OpenIDConnectProviderArn,
        Tags: buildTags({ config, namespace, name }),
      }),
      (tagParams) => iam().tagOpenIDConnectProvider(tagParams),
      tap((oidcp) => {
        logger.debug(`created iam oidc result ${tos({ name, oidcp })}`);
        logger.info(`created iam oidc ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteOpenIDConnectProvider-property
  const destroy = async ({ live }) =>
    pipe([
      tap(() => {
        logger.info(`destroy iam oidc`);
      }),
      () => ({
        OpenIDConnectProviderArn: findId({ live }),
        name: findName({ live }),
      }),
      ({ OpenIDConnectProviderArn, name }) =>
        pipe([
          tap(() => {
            logger.info(
              `destroy iam oidc ${JSON.stringify({
                name,
                OpenIDConnectProviderArn,
              })}`
            );
          }),
          () =>
            iam().deleteOpenIDConnectProvider({
              OpenIDConnectProviderArn,
            }),
          tap(() =>
            retryCall({
              name: `iam oidc isDownById: ${name} OpenIDConnectProviderArn: ${OpenIDConnectProviderArn}`,
              fn: () => isDownById({ id: OpenIDConnectProviderArn }),
              config,
            })
          ),
          tap(() => {
            logger.info(
              `destroy iam oidc done, ${JSON.stringify({
                name,
                OpenIDConnectProviderArn,
              })}`
            );
          }),
        ])(),
    ])();

  const clusterProperties = ({ cluster }) =>
    pipe([
      () => cluster,
      switchCase([
        isEmpty,
        () => ({}),
        pipe([
          () => ({
            Url: getField(cluster, "identity.oidc.issuer"),
          }),
        ]),
      ]),
    ])();

  const configDefault = ({ name, properties, dependencies: { cluster } }) =>
    pipe([
      tap(() => {
        assert(name);
      }),
      () => properties,
      defaultsDeep(clusterProperties({ cluster })),
      defaultsDeep({ ClientIDList: ["sts.amazonaws.com"] }),
    ])();

  return {
    spec,
    findNamespace,
    findId,
    findDependencies,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
    shouldRetryOnExceptionDelete,
  };
};
