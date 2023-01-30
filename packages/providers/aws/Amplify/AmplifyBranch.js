const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, append, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { Tagger } = require("./AmplifyCommon");

const pickId = pipe([
  tap(({ appId, branchName }) => {
    assert(appId);
    assert(branchName);
  }),
  pick(["appId", "branchName"]),
]);

const buildArn = () =>
  pipe([
    get("branchArn"),
    tap((branchArn) => {
      assert(branchArn);
    }),
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
exports.AmplifyBranch = () => ({
  type: "Branch",
  package: "amplify",
  client: "Amplify",
  propertiesDefault: {},
  omitProperties: [
    "branchArn",
    "appId",
    "createTime",
    "updateTime",
    "activeJobId",
    "backendEnvironmentArn",
    "thumbnailUrl",
  ],
  inferName:
    ({ dependenciesSpec: { app } }) =>
    ({ branchName }) =>
      pipe([
        tap((params) => {
          assert(app);
          assert(branchName);
        }),
        () => `${app}::${branchName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap((params) => {
          assert(live.branchName);
        }),
        () => live,
        get("appId"),
        tap((id) => {
          assert(id);
        }),
        lives.getById({
          type: "App",
          group: "Amplify",
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${live.branchName}`),
      ])(),
  findId: () =>
    pipe([
      get("branchArn"),
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
    backendEnvironment: {
      type: "BackendEnvironment",
      group: "Amplify",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("backendEnvironmentArn")]),
    },
  },
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#getBranch-property
  getById: {
    method: "getBranch",
    getField: "branch",
    pickId,
    decorate,
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "App", group: "Amplify" },
          pickKey: pipe([pick(["appId"])]),
          method: "listBranches",
          getParam: "branches",
          config,
          decorate: ({ parent }) =>
            pipe([defaultsDeep({ appId: parent.appId })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#createBranch-property
  create: {
    method: "createBranch",
    pickCreated: ({ payload }) => pipe([get("branch"), defaultsDeep(payload)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#updateBranch-property
  update: {
    method: "updateBranch",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#deleteBranch-property
  destroy: {
    method: "deleteBranch",
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
    dependencies: { app, backendEnvironment },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(app);
      }),
      () => otherProps,
      defaultsDeep({
        appId: getField(app, "appId"),
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => backendEnvironment,
        assign({
          backendEnvironmentArn: () =>
            getField(backendEnvironment, "backendEnvironmentArn"),
        })
      ),
    ])(),
});
