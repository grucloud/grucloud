const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./WorkSpacesWebCommon");

const buildArn = () =>
  pipe([
    get("identityProviderArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ identityProviderArn }) => {
    assert(identityProviderArn);
  }),
  pick(["identityProviderArn"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    defaultsDeep({ portalArn: live.portalArn }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html
exports.WorkSpacesWebIdentityProvider = () => ({
  type: "IdentityProvider",
  package: "workspaces-web",
  client: "WorkSpacesWeb",
  propertiesDefault: {},
  omitProperties: ["identityProviderArn", "associatedPortalArns", "portalArn"],
  inferName: () =>
    pipe([
      get("identityProviderName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("identityProviderName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("identityProviderArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    portal: {
      type: "Portal",
      group: "WorkSpacesWeb",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("portalArn"),
          tap((portalArn) => {
            assert(portalArn);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#getIdentityProvider-property
  getById: {
    method: "getIdentityProvider",
    getField: "identityProvider",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#listIdentityProviders-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Portal", group: "WorkSpacesWeb" },
          pickKey: pipe([pick(["portalArn"])]),
          method: "listIdentityProviders",
          getParam: "identityProviders",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              defaultsDeep(parent),
              getById({}),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#createIdentityProvider-property
  create: {
    method: "createIdentityProvider",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#updateIdentityProvider-property
  update: {
    method: "updateIdentityProvider",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#deleteIdentityProvider-property
  destroy: {
    method: "deleteIdentityProvider",
    pickId,
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
    dependencies: { portal },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(portal);
      }),
      () => otherProps,
      defaultsDeep({
        tags: buildTags({ name, config, namespace, UserTags: tags }),
        portalArn: getField(portal, "portalArn"),
      }),
    ])(),
});
