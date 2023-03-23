const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./SignerCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ profileName }) => {
    assert(profileName);
  }),
  pick(["profileName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html
exports.SignerSigningProfile = () => ({
  type: "SigningProfile",
  package: "signer",
  client: "Signer",
  propertiesDefault: {
    signatureValidityPeriod: {
      type: "MONTHS",
      value: 135,
    },
  },
  //TODO
  cannotBeDeleted: () => () => true,
  omitProperties: [
    "profileVersion",
    "profileVersionArn",
    "revocationRecord.revokedAt",
    "revocationRecord.revokedBy",
    "arn",
    "status",
    "statusReason",
    "signingMaterial",
  ],
  inferName: () =>
    pipe([
      get("profileName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("profileName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("profileName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    certificate: {
      type: "Certificate",
      group: "ACM",
      dependencyId: () => pipe([get("signingMaterial.certificateArn")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#getSigningProfile-property
  getById: {
    method: "getSigningProfile",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#listSigningProfiles-property
  getList: {
    method: "listSigningProfiles",
    getParam: "profiles",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#putSigningProfile-property
  create: {
    method: "putSigningProfile",
    pickCreated: ({ payload }) => pipe([identity, defaultsDeep(payload)]),
    isInstanceUp: pipe([
      get("status"),
      tap((status) => {
        assert(status);
      }),
      isIn(["Active"]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#putSigningProfile-property
  update: {
    method: "putSigningProfile",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#deleteSigningProfile-property
  destroy: {
    method: "revokeSigningProfile",
    pickId: pipe([
      tap(({ profileName, profileVersion }) => {
        assert(profileName);
        assert(profileVersion);
      }),
      pick(["profileName", "profileVersion", "reason", "effectiveTime"]),
      defaultsDeep({
        effectiveTime: new Date(),
        reason: "revoked by GruCloud",
      }),
    ]),
    isInstanceDown: pipe([get("status"), isIn(["Revoked", "Canceled"])]),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { certificate },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(otherProps.platformId);
        assert(otherProps.profileName);
      }),
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => certificate,
        defaultsDeep({
          signingMaterial: {
            certificateArn: getField(certificate, "CertificateArn"),
          },
        })
      ),
    ])(),
});
