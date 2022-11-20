const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, values } = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ IdentityPoolId }) => {
    assert(IdentityPoolId);
  }),
  pick(["IdentityPoolId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const cannotBeDeleted = () => () => true;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html
exports.CognitoIdentityIdentityPoolRolesAttachments = ({ compare }) => ({
  type: "IdentityPoolRolesAttachments",
  package: "cognito-identity",
  client: "CognitoIdentity",
  propertiesDefault: {},
  omitProperties: ["IdentityPoolId"],
  inferName: pipe([
    get("dependenciesSpec.identityPool"),
    tap((Name) => {
      assert(Name);
    }),
  ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("IdentityPoolId"),
        tap((id) => {
          assert(id);
        }),
        (id) =>
          lives.getById({
            id,
            type: "IdentityPool",
            group: "Cognito",
            providerName: config.providerName,
          }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("IdentityPoolId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    identityPool: {
      type: "IdentityPool",
      group: "Cognito",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("IdentityPoolId")]),
    },
    iamRoles: {
      type: "Role",
      group: "IAM",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("Roles"), values]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  cannotBeDeleted,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#getIdentityPoolRolesAttachments-property
  getById: {
    method: "getIdentityPoolRoles",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#listIdentityPoolRolesAttachmentss-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "IdentityPool", group: "Cognito" },
          pickKey: pipe([pick(["IdentityPoolId"])]),
          method: "getIdentityPoolRoles",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#createIdentityPoolRolesAttachments-property
  create: {
    method: "setIdentityPoolRoles",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#setIdentityPoolRoles-property
  update: {
    method: "setIdentityPoolRoles",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#deleteIdentityPoolRolesAttachments-property
  destroy: {
    method: "setIdentityPoolRoles",
    pickId,
  },
  getByName: getByNameCore,
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Roles: pipe([
          get("Roles"),
          map(
            pipe([
              replaceWithName({
                groupType: "IAM::Role",
                path: "id",
                providerConfig,
                lives,
              }),
            ])
          ),
        ]),
      }),
    ]),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { identityPool },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(identityPool);
      }),
      () => otherProps,
      defaultsDeep({
        IdentityPoolId: getField(identityPool, "IdentityPoolId"),
      }),
    ])(),
});
