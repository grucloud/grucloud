const assert = require("assert");
const { pipe, tap, get, pick, map, eq, switchCase } = require("rubico");
const { defaultsDeep, find, unless, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ profileName, revisionId, statementId }) => {
    assert(profileName);
    assert(revisionId);
    assert(statementId);
  }),
  pick(["profileName", "revisionId", "statementId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html
exports.SignerSigningProfilePermission = () => ({
  type: "SigningProfilePermission",
  package: "signer",
  client: "Signer",
  propertiesDefault: {},
  omitProperties: ["profileVersion", "profileName", "principal"],
  inferName:
    ({ dependenciesSpec: {} }) =>
    ({ statementId }) =>
      pipe([() => `${statementId}`])(),
  findName:
    () =>
    ({ statementId }) =>
      pipe([
        tap((params) => {
          assert(statementId);
        }),
        () => `${statementId}`,
      ])(),
  findId: () =>
    pipe([
      get("statementId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    organisationsAccountPrincipal: {
      type: "Account",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("principal")]),
    },
    iamRolePrincipal: {
      type: "Role",
      group: "IAM",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("principal")]),
    },
    signingProfile: {
      type: "SigningProfile",
      group: "Signer",
      dependencyId: () => pipe([get("profileName")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#describeProfilePermission-property
  getById: {
    method: "listProfilePermissions",
    pickId,
    decorate:
      ({ live }) =>
      ({ permissions, revisionId }) =>
        pipe([
          tap(() => {
            assert(permissions);
            assert(live.statementId);
          }),
          () => permissions,
          find(eq(get("statementId"), live.statementId)),
          unless(
            isEmpty,
            defaultsDeep({ profileName: live.profileName, revisionId })
          ),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#listProfilePermissions-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "SigningProfile", group: "Signer" },
          pickKey: pipe([
            pick(["profileName"]),
            tap(({ profileName }) => {
              assert(profileName);
            }),
          ]),
          method: "listProfilePermissions",
          config,
          decorate:
            ({ parent }) =>
            ({ permissions, revisionId }) =>
              pipe([
                tap(() => {
                  assert(revisionId);
                  assert(parent.profileName);
                }),
                () => permissions,
                map(
                  defaultsDeep({ revisionId, profileName: parent.profileName })
                ),
              ])(),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#addProfilePermission-property
  create: {
    method: "addProfilePermission",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Signer.html#removeProfilePermission-property
  destroy: {
    method: "removeProfilePermission",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {
      signingProfile,
      organisationsAccountPrincipal,
      iamRolePrincipal,
    },
    config,
  }) =>
    pipe([
      tap((id) => {
        assert(signingProfile);
      }),
      () => otherProps,
      defaultsDeep({
        profileName: signingProfile.config.profileName,
        profileVersion: getField(signingProfile, "profileVersion"),
      }),
      switchCase([
        () => organisationsAccountPrincipal,
        defaultsDeep({
          principal: getField(organisationsAccountPrincipal, "Id"),
        }),
        () => iamRolePrincipal,
        defaultsDeep({ principal: getField(iamRolePrincipal, "Arn") }),
        () => {
          assert(false, "missing principal account or role");
        },
      ]),
    ])(),
});
