const assert = require("assert");
const { pipe, tap, get, switchCase, assign, pick, not, eq } = require("rubico");
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
  ignoreErrorCodes,
} = require("./AwsIamCommon");

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

exports.fetchThumbprint = fetchThumbprint;

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

  const findId = () => get("Arn");
  const pickId = pipe([({ Arn }) => ({ OpenIDConnectProviderArn: Arn })]);

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

  const findNamespace = (param) => (live) =>
    pipe([
      () => [findNamespaceInTags(param)(live)],
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
        () => ({ Url: payload.Url }),
        fetchThumbprint,
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
    ])();

  return {
    spec,
    findNamespace,
    findId,
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
