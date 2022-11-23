const assert = require("assert");
const { pipe, tap, get, pick, eq, tryCatch } = require("rubico");
const { defaultsDeep, identity, unless, isEmpty, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ CertificateAuthorityArn, Principal, SourceAccount }) => {
    assert(CertificateAuthorityArn);
    assert(Principal);
  }),
  pick(["CertificateAuthorityArn", "Principal", "SourceAccount"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html
exports.ACMPCAPermission = ({ compare }) => ({
  type: "Permission",
  package: "acm-pca",
  client: "ACMPCA",
  propertiesDefault: {},
  omitProperties: ["CertificateAuthorityArn", "CreatedAt", "SourceAccount"],
  inferName: ({
    properties: { Principal },
    dependenciesSpec: { certificateAuthority },
  }) =>
    pipe([
      tap((params) => {
        assert(certificateAuthority);
        assert(Principal);
      }),
      () => `${certificateAuthority}::${Principal}`,
    ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(live.Principal);
        }),
        () => live,
        get("CertificateAuthorityArn"),
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
        append(`::${live.Principal}`),
      ])(),
  findId:
    () =>
    ({ CertificateAuthorityArn, Principal }) =>
      pipe([
        () => `${CertificateAuthorityArn}::${Principal}`,
        tap((id) => {
          assert(id);
        }),
      ])(),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    certificateAuthority: {
      type: "CertificateAuthority",
      group: "ACMPCA",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("CertificateAuthorityArn"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  getById:
    ({ endpoint }) =>
    ({ lives, config }) =>
    (live) =>
      tryCatch(
        pipe([
          tap((params) => {
            assert(endpoint);
            assert(live);
            assert(live.Principal);
          }),
          () => live,
          pick(["CertificateAuthorityArn"]),
          endpoint().listPermissions,
          get("Permissions"),
          find(eq(get("Principal"), live.Principal)),
          unless(isEmpty, decorate({ endpoint, live })),
        ]),
        // TODO ResourceNotFoundException
        (error) =>
          pipe([
            tap(() => {
              assert(error);
            }),
            () => undefined,
          ])()
      )(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html#listPermissions-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "CertificateAuthority", group: "ACMPCA" },
          pickKey: pipe([
            pick(["CertificateAuthorityArn"]),
            tap((CertificateAuthorityArn) => {
              assert(CertificateAuthorityArn);
            }),
          ]),
          method: "listPermissions",
          getParam: "Permissions",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html#createPermission-property
  create: {
    method: "createPermission",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ACMPCA.html#deletePermission-property
  destroy: {
    method: "deletePermission",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
