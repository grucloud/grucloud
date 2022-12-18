const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  and,
  or,
  not,
  filter,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  first,
  pluck,
  callProp,
  when,
  isEmpty,
  unless,
  identity,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./CognitoIdentityCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ IdentityPoolId }) => {
    assert(IdentityPoolId);
  }),
  pick(["IdentityPoolId"]),
]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        ({ IdentityPoolId }) =>
          `arn:aws:cognito-identity:${
            config.region
          }:${config.accountId()}:identitypool/${IdentityPoolId}`,
      ]),
    }),
  ]);

const liveToTags = ({ IdentityPoolTags, ...other }) => ({
  ...other,
  Tags: IdentityPoolTags,
});

const tagsToPayload = ({ Tags, ...other }) => ({
  ...other,
  IdentityPoolTags: Tags,
});

const decorate = ({ endpoint, config }) =>
  pipe([liveToTags, assignArn({ config })]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html
exports.CognitoIdentityIdentityPool = ({ compare }) => ({
  type: "IdentityPool",
  package: "cognito-identity",
  client: "CognitoIdentity",
  propertiesDefault: {},
  omitProperties: ["IdentityPoolId", "Arn"],
  inferName: () =>
    pipe([
      get("IdentityPoolName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("IdentityPoolName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("IdentityPoolId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    cognitoIdentityProviders: {
      type: "UserPoolClient",
      group: "CognitoIdentityServiceProvider",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("CognitoIdentityProviders"), pluck("ClientId")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#describeIdentityPool-property
  getById: {
    method: "describeIdentityPool",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#listIdentityPools-property
  getList: {
    enhanceParams: () => () => ({ MaxResults: 60 }),
    method: "listIdentityPools",
    getParam: "IdentityPools",
    decorate: ({ getById }) => pipe([getById]),
  },
  create: {
    filterPayload: tagsToPayload,
    method: "createIdentityPool",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#updateIdentityPool-property
  update: {
    method: "updateIdentityPool",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, tagsToPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#deleteIdentityPool-property
  destroy: {
    method: "deleteIdentityPool",
    pickId,
  },
  getByName: getByNameCore,
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        CognitoIdentityProviders: pipe([
          get("CognitoIdentityProviders"),
          map(
            assign({
              ClientId: pipe([
                get("ClientId"),
                replaceWithName({
                  groupType: "CognitoIdentityServiceProvider::UserPoolClient",
                  path: "id",
                  providerConfig,
                  lives,
                }),
              ]),
              ProviderName: pipe([
                get("ProviderName"),
                replaceWithName({
                  groupType: "CognitoIdentityServiceProvider::UserPool",
                  path: "live.ProviderName",
                  pathLive: "live.ProviderName",
                  providerConfig,
                  lives,
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
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
        Tags: buildTagsObject({
          name,
          config,
          namespace,
          userTags: Tags,
        }),
      }),
    ])(),
});
