const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");
const { v4: uuidv4 } = require("uuid");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger } = require("./EKSCommon");

const buildArn = () =>
  pipe([
    get("oidc.identityProviderConfigArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ clusterName, oidc }) => {
    assert(clusterName);
    assert(oidc);
    assert(oidc.identityProviderConfigName);
  }),
  ({ clusterName, oidc: { identityProviderConfigName } }) => ({
    clusterName,
    identityProviderConfig: {
      name: identityProviderConfigName,
      type: "oidc",
    },
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({ oidc }) => {
      assert(oidc);
    }),
    ({ oidc: { clusterName, status, tags, ...oidc } }) => ({
      clusterName,
      status,
      tags,
      oidc,
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html
exports.EKSIdentityProviderConfig = () => ({
  type: "IdentityProviderConfig",
  package: "eks",
  client: "EKS",
  propertiesDefault: {},
  omitProperties: [
    "status",
    "oidc.identityProviderConfigArn",
    "clientRequestToken",
  ],
  inferName: () =>
    pipe([
      get("oidc.identityProviderConfigName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("oidc.identityProviderConfigName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("oidc.identityProviderConfigArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    cluster: {
      type: "Cluster",
      group: "EKS",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("clusterName"),
          lives.getByName({
            type: "Cluster",
            group: "EKS",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        oidc: pipe([
          get("oidc"),
          tap((oidc) => {
            assert(oidc);
          }),
          assign({
            clientId: pipe([
              get("clientId"),
              replaceWithName({
                groupType: "EKS::Cluster",
                path: "live.identity.oidc.clientId",
                pathLive: "live.identity.oidc.clientId",
                providerConfig,
                lives,
              }),
            ]),
            issuerUrl: pipe([
              get("issuerUrl"),
              replaceWithName({
                groupType: "EKS::Cluster",
                path: "live.identity.oidc.issuer",
                pathLive: "live.identity.oidc.issuer",
                providerConfig,
                lives,
              }),
            ]),
          }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#describeIdentityProviderConfig-property
  getById: {
    method: "describeIdentityProviderConfig",
    getField: "identityProviderConfig",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#listIdentityProviderConfigs-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Cluster", group: "EKS" },
          pickKey: pipe([
            tap(({ name }) => {
              assert(name);
            }),
            ({ name }) => ({ clusterName: name }),
          ]),
          method: "listIdentityProviderConfigs",
          getParam: "identityProviderConfigs",
          config,
          decorate: ({ lives, parent }) =>
            pipe([
              tap(({ type, name }) => {
                assert(type);
                assert(name);
                assert(parent.name);
              }),
              (oidc) => ({
                clusterName: parent.name,
                oidc: { identityProviderConfigName: oidc.name, type: "oidc" },
              }),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#associateIdentityProviderConfig-property
  create: {
    method: "associateIdentityProviderConfig",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([
      get("status"),
      tap((status) => {
        assert(status);
      }),
      isIn(["ACTIVE"]),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#updateIdentityProviderConfig-property
  // TODO
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#deleteIdentityProviderConfig-property
  destroy: {
    method: "disassociateIdentityProviderConfig",
    pickId,
    // "Identity provider config is not associated with cluster"
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        clientRequestToken: uuidv4(),
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
      }),
    ])(),
});
