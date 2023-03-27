const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./ResilienceHubCommon");

const buildArn = () =>
  pipe([
    get("appArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ appArn }) => {
    assert(appArn);
  }),
  pick(["appArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResilienceHub.html
exports.ResilienceHubApp = () => ({
  type: "App",
  package: "resiliencehub",
  client: "Resiliencehub",
  propertiesDefault: {},
  omitProperties: [
    "appArn",
    "status",
    "resiliencyScore",
    "creationTime",
    "complianceStatus",
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
      get("appArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResilienceHub.html#describeApp-property
  getById: {
    method: "describeApp",
    getField: "app",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResilienceHub.html#listApps-property
  getList: {
    method: "listApps",
    getParam: "appSummaries",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResilienceHub.html#createApp-property
  create: {
    method: "createApp",
    pickCreated: ({ payload }) => pipe([get("app")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResilienceHub.html#updateApp-property
  update: {
    method: "updateApp",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResilienceHub.html#deleteApp-property
  destroy: {
    method: "deleteApp",
    pickId: pipe([pickId, defaultsDeep({ forceDelete: true })]),
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
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
