const assert = require("assert");
const { pipe, tap, get, pick, assign, not, omit } = require("rubico");
const { defaultsDeep, when, callProp } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./AmplifyCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const buildArn = () =>
  pipe([
    get("appArn"),
    tap((appArn) => {
      assert(appArn);
    }),
  ]);

const pickId = pipe([
  tap(({ appId }) => {
    assert(appId);
  }),
  pick(["appId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);
const isGitRepo = pipe([
  get("repository"),
  callProp("startsWith", "https://github.com/"),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html
exports.AmplifyApp = ({ compare }) => ({
  type: "App",
  package: "amplify",
  client: "Amplify",
  propertiesDefault: {},
  omitProperties: [
    "appArn",
    "appId",
    "createTime",
    "updateTime",
    "iamServiceRoleArn",
    "defaultDomain",
  ],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("appId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  environmentVariables: [
    {
      path: "oauthToken",
      suffix: "APP_OAUTHTOKEN",
      rejectEnvironmentVariable: () => pipe([isGitRepo]),
    },
    {
      path: "accessToken",
      suffix: "APP_ACCESSTOKEN",
      rejectEnvironmentVariable: () => pipe([not(isGitRepo)]),
    },
    // enableBasicAuth
    {
      path: "basicAuthCredentials",
      suffix: "APP_BASICAUTHCREDENTIALS",
      rejectEnvironmentVariable: () => pipe([not(get("enableBasicAuth"))]),
    },
  ],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("iamServiceRoleArn")]),
    },
  },
  ignoreErrorCodes: ["NotFoundException"],
  compare: compare({ filterAll: () => pipe([omit(["accessToken"])]) }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("productionBranch"),
        assign({
          productionBranch: pipe([
            get("productionBranch"),
            assign({
              thumbnailUrl: pipe([
                get("thumbnailUrl"),
                replaceAccountAndRegion({
                  providerConfig,
                  lives,
                }),
              ]),
            }),
          ]),
        })
      ),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#getApp-property
  getById: {
    method: "getApp",
    getField: "app",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#listApps-property
  getList: {
    method: "listApps",
    getParam: "apps",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#createApp-property
  create: {
    method: "createApp",
    pickCreated: ({ payload }) => pipe([get("app")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#updateApp-property
  update: {
    method: "updateApp",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Amplify.html#deleteApp-property
  destroy: {
    method: "deleteApp",
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
    dependencies: { iamRole },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => iamRole,
        assign({ iamServiceRoleArn: () => getField(iamRole, "Arn") })
      ),
    ])(),
});
