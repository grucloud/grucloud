const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ appId, environmentName }) => {
    assert(appId);
    assert(environmentName);
  }),
  pick(["appId", "environmentName"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live.appId);
    }),
    defaultsDeep({ appId: live.appId }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html
exports.AmplifyBackendEnvironment = () => ({
  type: "BackendEnvironment",
  package: "amplify",
  client: "Amplify",
  propertiesDefault: {},
  omitProperties: [
    "backendEnvironmentArn",
    "appId",
    "createTime",
    "updateTime",
  ],
  inferName: ({ properties: { environmentName }, dependenciesSpec: { app } }) =>
    pipe([
      tap((params) => {
        assert(app);
        assert(environmentName);
      }),
      () => `${app}::${environmentName}`,
    ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(live.environmentName);
        }),
        () => live,
        get("appId"),
        tap((id) => {
          assert(id);
        }),
        (id) =>
          lives.getById({
            id,
            type: "App",
            group: "Amplify",
            providerName: config.providerName,
          }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${live.environmentName}`),
      ])(),
  findId: () =>
    pipe([
      get("backendEnvironmentArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    app: {
      type: "App",
      group: "Amplify",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("appId")]),
    },
  },
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#getBackendEnvironment-property
  getById: {
    method: "getBackendEnvironment",
    getField: "backendEnvironment",
    pickId,
    decorate,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "App", group: "Amplify" },
          pickKey: pipe([pick(["appId"])]),
          method: "listBackendEnvironments",
          getParam: "backendEnvironments",
          config,
          decorate: ({ parent }) =>
            pipe([defaultsDeep({ appId: parent.appId })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#createBackendEnvironment-property
  create: {
    method: "createBackendEnvironment",
    pickCreated: ({ payload }) => pipe([get("backendEnvironment")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#deleteBackendEnvironment-property
  destroy: {
    method: "deleteBackendEnvironment",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { app },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(app);
      }),
      () => otherProps,
      defaultsDeep({
        app: getField(app, "appId"),
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
