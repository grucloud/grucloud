const assert = require("assert");
const { pipe, tap, get, switchCase, assign, pick, eq, or } = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  find,
  prepend,
  callProp,
  identity,
} = require("rubico/x");
const tls = require("tls");

const { hasDependency } = require("@grucloud/core/generatorUtils");

const logger = require("@grucloud/core/logger")({
  prefix: "IamOIDC",
});

const { buildTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const {
  tagResourceIam,
  untagResourceIam,
  ignoreErrorCodes,
} = require("./IAMCommon");

const formatThumbPrint = pipe([
  get("fingerprint"),
  (fingerprint) => fingerprint.replace(/:/g, ""),
  //TODO check
  //callProp("replace", /:/g, ""),
  callProp("toLowerCase"),
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

const decorate = ({ endpoint, live }) =>
  pipe([
    tap(() => {
      assert(live.OpenIDConnectProviderArn);
    }),
    pick(["ClientIDList", "ThumbprintList", "Url", "CreateDate"]),
    // TODO order ClientIDList
    assign({
      OpenIDConnectProviderArn: () => live.OpenIDConnectProviderArn,
    }),
    assign({
      Tags: pipe([
        pickId,
        endpoint().listOpenIDConnectProviderTags,
        get("Tags"),
      ]),
    }),
  ]);

const findId = () =>
  pipe([
    get("OpenIDConnectProviderArn"),
    tap((OpenIDConnectProviderArn) => {
      assert(OpenIDConnectProviderArn);
    }),
  ]);

const pickId = pipe([
  tap(({ OpenIDConnectProviderArn }) => {
    assert(OpenIDConnectProviderArn);
  }),
  pick(["OpenIDConnectProviderArn"]),
]);

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      get("Url"),
      (Url) =>
        pipe([
          lives.getByType({
            providerName: config.providerName,
            type: "Cluster",
            group: "EKS",
          }),
          find(eq(get("live.identity.oidc.issuer"), `https://${Url}`)),
          get("name"),
          switchCase([
            isEmpty,
            pipe([() => Url, callProp("replace", "https://", "")]),
            prepend("eks-cluster::"),
          ]),
        ])(),
      prepend("oidp::"),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.IAMOpenIDConnectProvider = ({ compare }) => ({
  type: "OpenIDConnectProvider",
  package: "iam",
  client: "IAM",
  propertiesDefault: {},
  omitProperties: ["ThumbprintList", "CreateDate", "OpenIDConnectProviderArn"],
  inferName:
    ({ dependenciesSpec }) =>
    (properties) =>
      pipe([
        () => dependenciesSpec,
        switchCase([
          get("cluster"),
          pipe([get("cluster"), prepend("eks-cluster::")]),
          pipe([
            () => properties,
            get("Url"),
            tap((Url) => {
              assert(Url);
            }),
            callProp("replace", "https://", ""),
          ]),
        ]),
        prepend("oidp::"),
      ])(),
  findName,
  findId,
  ignoreErrorCodes,
  filterLive: () => pick(["ClientIDList", "Url"]),
  dependencies: {
    cluster: {
      type: "Cluster",
      group: "EKS",
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            lives.getByType({
              type: "Cluster",
              group: "EKS",
              providerName: config.providerName,
            }),
            find(eq(get("live.identity.oidc.issuer"), `https://${live.Url}`)),
            get("id"),
          ])(),
    },
  },
  compare: compare({
    filterLive: () =>
      pipe([assign({ Url: pipe([get("Url"), prepend("https://")]) })]),
  }),
  hasNoProperty: ({ lives, resource }) =>
    pipe([
      () => resource,
      or([hasDependency({ type: "Cluster", group: "EKS" })]),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#getOpenIDConnectProvider-property
  getById: {
    pickId,
    method: "getOpenIDConnectProvider",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listOpenIDConnectProviders-property
  getList: {
    method: "listOpenIDConnectProviders",
    getParam: "OpenIDConnectProviderList",
    decorate: ({ getById }) =>
      pipe([
        tap((Arn) => {
          assert(Arn);
        }),
        ({ Arn }) => ({ OpenIDConnectProviderArn: Arn }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createOpenIDConnectProvider-property
  create: {
    method: "createOpenIDConnectProvider",
    filterPayload: (payload) =>
      pipe([
        tap(() => {
          assert(payload.Url);
        }),
        () => ({ Url: payload.Url }),
        fetchThumbprint,
        (thumbprint) => defaultsDeep({ ThumbprintList: [thumbprint] })(payload),
      ])(),
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#updateOpenIDConnectProvider-property
  update: {
    method: "updateOpenIDConnectProvider",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteOpenIDConnectProvider-property
  destroy: {
    pickId,
    method: "deleteOpenIDConnectProvider",
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource,
    untagResource,
  }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, Url, ...otherProps },
    dependencies: { cluster },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(name);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ config, namespace, name, UserTags: Tags }),
      }),
      switchCase([
        () => cluster,
        defaultsDeep({
          Url: getField(cluster, "identity.oidc.issuer"),
        }),
        defaultsDeep({
          Url: `https://${Url}`,
        }),
      ]),
      defaultsDeep({ ClientIDList: ["sts.amazonaws.com"] }),
    ])(),
});
