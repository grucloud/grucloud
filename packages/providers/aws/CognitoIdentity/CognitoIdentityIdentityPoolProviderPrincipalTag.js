const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  flatMap,
  map,
  tryCatch,
  filter,
  not,
  eq,
} = require("rubico");
const { defaultsDeep, isEmpty, find } = require("rubico/x");

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

const cannotBeDeleted = () => true;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html
exports.CognitoIdentityIdentityPoolProviderPrincipalTag = ({ compare }) => ({
  type: "IdentityPoolProviderPrincipalTag",
  package: "cognito-identity",
  client: "CognitoIdentity",
  propertiesDefault: {},
  omitProperties: ["IdentityPoolId", "IdentityProviderName"],
  inferName: pipe([
    get("dependenciesSpec.identityPool"),
    tap((Name) => {
      assert(Name);
    }),
  ]),
  findName: pipe([
    get("live"),
    get("IdentityPoolName"),
    tap((name) => {
      assert(name);
    }),
  ]),
  findName: ({ live, lives, config }) =>
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
        }),
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ])(),
  findId: pipe([
    get("live"),
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
    cognitoUserPool: {
      type: "UserPool",
      group: "CognitoIdentityServiceProvider",
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            () =>
              lives.getByType({
                type: "UserPool",
                group: "CognitoIdentityServiceProvider",
                providerName: config.providerName,
              }),
            find(eq(get("live.ProviderName"), live.IdentityProviderName)),
            get("id"),
            tap((id) => {
              assert(id);
            }),
          ])(),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  cannotBeDeleted,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#getIdentityPoolProviderPrincipalTag-property
  getById: {
    method: "getIdentityPoolRoles",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#listIdentityPoolProviderPrincipalTags-property
  getList:
    ({ client, endpoint, getById }) =>
    ({ lives, config }) =>
      pipe([
        tap((params) => {
          assert(lives);
          assert(config);
        }),
        () =>
          lives.getByType({
            type: "IdentityPool",
            group: "Cognito",
            providerName: config.providerName,
          }),
        tap((params) => {
          assert(true);
        }),
        flatMap(
          pipe([
            get("live"),
            ({ IdentityPoolId, CognitoIdentityProviders }) =>
              pipe([
                () => CognitoIdentityProviders,
                map(
                  pipe([
                    ({ ProviderName }) => ({
                      IdentityPoolId,
                      IdentityProviderName: ProviderName,
                    }),
                    tryCatch(
                      endpoint().getPrincipalTagAttributeMap,
                      (error) => undefined
                    ),
                    tap((params) => {
                      assert(true);
                    }),
                  ])
                ),
              ])(),
          ])
        ),
        filter(not(isEmpty)),
      ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#createIdentityPoolProviderPrincipalTag-property
  create: {
    method: "setPrincipalTagAttributeMap",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#setIdentityPoolRoles-property
  update: {
    method: "setPrincipalTagAttributeMap",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#deleteIdentityPoolProviderPrincipalTag-property
  destroy: {
    method: "setPrincipalTagAttributeMap",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { identityPool, cognitoUserPool },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(identityPool);
        assert(cognitoUserPool);
      }),
      () => otherProps,
      defaultsDeep({
        IdentityPoolId: getField(identityPool, "IdentityPoolId"),
        IdentityProviderName: getField(cognitoUserPool, "ProviderName"),
      }),
    ])(),
});
