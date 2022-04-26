const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  switchCase,
  eq,
  assign,
  pick,
  not,
} = require("rubico");
const { defaultsDeep, isEmpty, find, prepend, callProp } = require("rubico/x");
const tls = require("tls");

const logger = require("@grucloud/core/logger")({
  prefix: "IamOIDC",
});

const { buildTags, findNamespaceInTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createIAM,
  tagResourceIam,
  untagResourceIam,
} = require("./AwsIamCommon");

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
    getLastCertificate,
    formatThumbPrint,
    tap((fingerprint) => {
      logger.debug(`fingerprint ${fingerprint}`);
    }),
  ])();

exports.fetchThumbprint = fetchThumbprint;

const ignoreErrorCodes = ["NoSuchEntity"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#tagOpenIDConnectProvider-property
const tagResource = tagResourceIam({
  propertyName: "OpenIDConnectProviderArn",
  field: "Arn",
  method: "tagOpenIDConnectProvider",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagOpenIDConnectProvider-property
const untagResource = untagResourceIam({
  propertyName: "OpenIDConnectProviderArn",
  field: "Arn",
  method: "untagOpenIDConnectProvider",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamOpenIDConnectProvider = ({ spec, config }) => {
  const iam = createIAM(config);
  const client = AwsClient({ spec, config })(iam);
  const { providerName } = config;

  const findId = get("live.Arn");
  const pickId = pipe([({ Arn }) => ({ OpenIDConnectProviderArn: Arn })]);

  //TODO look for cluster name
  const findName = ({ live }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => live,
      get("Url"),
      callProp("replace", "https://", ""),
      prepend("oidp::"),
    ])();

  const findDependencies = ({ live, lives }) => [
    {
      type: "Cluster",
      group: "EKS",
      ids: [
        pipe([
          () =>
            lives.getByType({
              type: "Cluster",
              group: "EKS",
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#getOpenIDConnectProvider-property
  const getById = client.getById({
    pickId,
    method: "getOpenIDConnectProvider",
    ignoreErrorCodes,
  });
  //TODO decorate
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listOpenIDConnectProviders-property
  const getList = client.getList({
    method: "listOpenIDConnectProviders",
    getParam: "OpenIDConnectProviderList",
    decorate:
      () =>
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
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createOpenIDConnectProvider-property
  const create = client.create({
    method: "createOpenIDConnectProvider",
    filterPayload: (payload) =>
      pipe([
        tap(() => {
          assert(payload.Url);
        }),
        () => fetchThumbprint({ Url: payload.Url }),
        (thumbprint) => defaultsDeep({ ThumbprintList: [thumbprint] })(payload),
      ])(),
    pickCreated: ({ payload }) =>
      pipe([
        ({ OpenIDConnectProviderArn }) => ({ Arn: OpenIDConnectProviderArn }),
      ]),
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteOpenIDConnectProvider-property
  const destroy = client.destroy({
    pickId,
    method: "deleteOpenIDConnectProvider",
    getById,
    ignoreErrorCodes,
  });

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

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, Url, ...otherProps },
    dependencies: { cluster },
  }) =>
    pipe([
      tap(() => {
        assert(name);
      }),
      () => otherProps,
      defaultsDeep({
        Url: `https://${Url}`,
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
      defaultsDeep(clusterProperties({ cluster })),
      defaultsDeep({ ClientIDList: ["sts.amazonaws.com"] }),
    ])();

  return {
    spec,
    findNamespace,
    findId,
    findDependencies,
    getByName,
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({ iam }),
    untagResource: untagResource({ iam }),
  };
};
