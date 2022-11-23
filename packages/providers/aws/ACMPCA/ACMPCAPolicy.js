const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ ResourceArn }) => {
    assert(ResourceArn);
  }),
  pick(["ResourceArn"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap(({ Policy }) => {
      assert(Policy);
      assert(endpoint);
      assert(live.ResourceArn);
    }),
    assign({
      ResourceArn: () => live.ResourceArn,
      Policy: pipe([get("Policy"), JSON.parse]),
    }),
  ]);

const filterPayload = pipe([
  assign({
    Policy: pipe([
      get("Policy"),
      tap((Policy) => {
        assert(Policy);
      }),
      JSON.stringify,
    ]),
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html
exports.ACMPCAPolicy = ({ compare }) => ({
  type: "Policy",
  package: "acm-pca",
  client: "ACMPCA",
  propertiesDefault: {},
  omitProperties: ["ResourceArn"],
  inferName: ({ dependenciesSpec: { certificateAuthority } }) =>
    pipe([
      tap((params) => {
        assert(certificateAuthority);
      }),
      () => `${certificateAuthority}`,
    ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("ResourceArn"),
        tap((id) => {
          assert(id);
        }),
        (id) =>
          lives.getById({
            id,
            type: "CertificateAuthority",
            group: "ACMPCA",
            providerName: config.providerName,
          }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      pick(["ResourceArn"]),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    certificateAuthority: {
      type: "CertificateAuthority",
      group: "ACMPCA",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ResourceArn"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  getById: {
    pickId,
    method: "getPolicy",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html#getPolicy-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "CertificateAuthority", group: "ACMPCA" },
          pickKey: pipe([
            tap((CertificateAuthorityArn) => {
              assert(CertificateAuthorityArn);
            }),
            ({ CertificateAuthorityArn }) => ({
              ResourceArn: CertificateAuthorityArn,
            }),
          ]),
          method: "getPolicy",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(parent.CertificateAuthorityArn);
              }),
              decorate({
                endpoint,
                live: { ResourceArn: parent.CertificateAuthorityArn },
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html#putPolicy-property
  create: {
    method: "putPolicy",
    filterPayload,
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html#deletePolicy-property
  destroy: {
    method: "deletePolicy",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { certificateAuthority },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(certificateAuthority);
        assert(properties.Policy);
      }),
      () => properties,
      defaultsDeep({
        CertificateAuthorityArn: getField(
          certificateAuthority,
          "CertificateAuthorityArn"
        ),
      }),
    ])(),
});
