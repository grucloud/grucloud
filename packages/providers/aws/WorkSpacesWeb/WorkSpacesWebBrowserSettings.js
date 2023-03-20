const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const {
  Tagger,
  assignTags,
  associate,
  disassociate,
} = require("./WorkSpacesWebCommon");

const buildArn = () =>
  pipe([
    get("browserSettingsArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ browserSettingsArn }) => {
    assert(browserSettingsArn);
  }),
  pick(["browserSettingsArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assign({ browserPolicy: pipe([get("browserPolicy"), JSON.parse]) }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

const filterPayload = pipe([
  assign({ browserPolicy: pipe([get("browserPolicy"), JSON.stringify]) }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html
exports.WorkSpacesWebBrowserSettings = () => ({
  type: "BrowserSettings",
  package: "workspaces-web",
  client: "WorkSpacesWeb",
  propertiesDefault: {},
  omitProperties: ["browserSettingsArn", "associatedPortalArns"],
  inferName: () => pipe([() => "default"]),
  findName: () => pipe([() => "default"]),
  findId: () =>
    pipe([
      get("browserSettingsArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    portals: {
      type: "Portal",
      group: "WorkSpacesWeb",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("associatedPortalArns")]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#getBrowserSettings-property
  getById: {
    method: "getBrowserSettings",
    getField: "browserSettings",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#listBrowserSettingss-property
  getList: {
    method: "listBrowserSettings",
    getParam: "browserSettings",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#createBrowserSettings-property
  create: {
    filterPayload,
    method: "createBrowserSettings",
    pickCreated: ({ payload }) => pipe([identity]),
    postCreate: ({ endpoint, resolvedDependencies: { portals } }) =>
      pipe([
        associate({
          endpoint,
          portals,
          method: "associateBrowserSettings",
          arnKey: "browserSettingsArn",
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#updateBrowserSettings-property
  update: {
    method: "updateBrowserSettings",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#deleteBrowserSettings-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap(disassociate({ endpoint, method: "disassociateBrowserSettings" })),
    method: "deleteBrowserSettings",
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
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({ name, config, namespace, UserTags: tags }),
      }),
    ])(),
});
