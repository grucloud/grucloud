const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ webhookId }) => {
    assert(webhookId);
  }),
  pick(["webhookId"]),
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
exports.AmplifyWebhook = () => ({
  type: "Webhook",
  package: "amplify",
  client: "Amplify",
  propertiesDefault: {},
  omitProperties: [
    "webhookArn",
    "webhookId",
    "branchName",
    "appId",
    "appName",
    "createTime",
    "updateTime",
  ],
  inferName: ({ properties: { webhookUrl }, dependenciesSpec: { app } }) =>
    pipe([
      tap((params) => {
        assert(app);
        assert(domainName);
      }),
      () => `${app}::${webhookUrl}`,
    ])(),
  findName:
    ({ lives, config }) =>
    ({ appName, webhookUrl }) =>
      pipe([
        tap((params) => {
          assert(appName);
          assert(webhookUrl);
        }),
        () => `${appName}::${live.webhookUrl}`,
      ])(),
  findId: () =>
    pipe([
      get("webhookArn"),
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
    branch: {
      type: "Branch",
      group: "Amplify",
      dependencyId:
        ({ lives, config }) =>
        ({ branchName, appName }) =>
          pipe([
            () => `${appName}::${branchName}`,
            (name) =>
              lives.getByName({
                name,
                type: "Branch",
                group: "Amplify",
                providerName: config.providerName,
              }),
            get("id"),
            tap((id) => {
              assert(id);
            }),
          ])(),
    },
  },
  ignoreErrorCodes: ["NotFoundException", "BadRequestException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#getWebhook-property
  getById: {
    method: "getWebhook",
    getField: "webhook",
    pickId,
    decorate,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "App", group: "Amplify" },
          pickKey: pipe([pick(["appId"])]),
          method: "listWebhooks",
          getParam: "webhooks",
          config,
          decorate: ({ parent }) =>
            pipe([defaultsDeep({ appId: parent.appId, appName: parent.name })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#createWebhook-property
  create: {
    method: "createWebhook",
    pickCreated: ({ payload }) => pipe([get("webhook")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#updateWebhook-property
  update: {
    method: "updateWebhook",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#deleteWebhook-property
  destroy: {
    method: "deleteWebhook",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    properties: { tags, ...otherProps },
    dependencies: { app, branch },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(app);
      }),
      () => otherProps,
      defaultsDeep({
        appId: getField(app, "appId"),
        branchName: getField(branch, "branchName"),
      }),
    ])(),
});
