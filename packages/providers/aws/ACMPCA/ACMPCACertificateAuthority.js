const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./ACMPCACommon");

const buildArn = () =>
  pipe([
    get("CertificateAuthorityArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ CertificateAuthorityArn }) => {
    assert(CertificateAuthorityArn);
  }),
  pick(["CertificateAuthorityArn"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap(({ Arn }) => {
      assert(endpoint);
      assert(Arn);
    }),
    ({ Arn, Type, ...other }) => ({
      CertificateAuthorityArn: Arn,
      CertificateAuthorityType: Type,
      ...other,
    }),
  ]);

const pickProperties = [
  "CertificateAuthorityConfiguration",
  "CertificateAuthorityType",
  "KeyStorageSecurityStandard",
  "RevocationConfiguration",
  "UsageMode",
];

const findNameFromLive = pipe([
  tap((params) => {
    assert(true);
  }),
  get("CertificateAuthorityConfiguration.Subject.CommonName"),
  tap((CommonName) => {
    assert(CommonName);
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html
exports.ACMPCACertificateAuthority = ({ compare }) => ({
  type: "CertificateAuthority",
  package: "acm-pca",
  client: "ACMPCA",
  propertiesDefault: { UsageMode: "GENERAL_PURPOSE" },
  omitProperties: [
    "CertificateAuthorityArn",
    "OwnerAccount",
    "CreatedAt",
    "LastStateChangeAt",
    "Serial",
    "Status",
    "NotBefore",
    "NotAfter",
    "FailureReason",
    "RestorableUntil",
  ],
  inferName: pipe([get("properties"), findNameFromLive]),
  findName: () => pipe([findNameFromLive]),
  findId: () =>
    pipe([
      get("CertificateAuthorityArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  compare: compare({ filterAll: () => pipe([pick(pickProperties)]) }),
  filterLive: ({}) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      pick(pickProperties),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html#getCertificateAuthority-property
  getById: {
    method: "describeCertificateAuthority",
    getField: "CertificateAuthority",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html#listCertificateAuthoritys-property
  getList: {
    method: "listCertificateAuthorities",
    getParam: "CertificateAuthorities",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html#createCertificateAuthority-property
  create: {
    method: "createCertificateAuthority",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html#updateCertificateAuthority-property
  update: {
    method: "updateCertificateAuthority",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html#deleteCertificateAuthority-property
  destroy: {
    //TODO predestroy
    method: "deleteCertificateAuthority",
    pickId,
    isInstanceDown: pipe([eq(get("Status"), "DELETED")]),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
