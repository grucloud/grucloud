const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, isIn, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./WorkSpacesWebCommon");

const buildArn = () =>
  pipe([
    get("portalArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ portalArn }) => {
    assert(portalArn);
  }),
  pick(["portalArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(config);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html
exports.WorkSpacesWebPortal = () => ({
  type: "Portal",
  package: "workspaces-web",
  client: "WorkSpacesWeb",
  propertiesDefault: {},
  omitProperties: [
    "portalArn",
    "browserSettingsArn",
    "creationDate",
    "networkSettingsArn",
    "portalEndpoint",
    "portalStatus",
    "trustStoreArn",
    "userAccessLoggingSettingsArn",
    "userSettingsArn",
  ],
  inferName: () =>
    pipe([
      get("displayName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("displayName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("portalArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#getPortal-property
  getById: {
    method: "getPortal",
    getField: "portal",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#listPortals-property
  getList: {
    method: "listPortals",
    getParam: "portals",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#createPortal-property
  create: {
    method: "createPortal",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([get("portalStatus"), isIn(["Active"])]),
    isInstanceError: pipe([get("portalStatus"), isIn(["Incomplete"])]),
    getErrorMessage: pipe([get("statusReason", "Incomplete")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#updatePortal-property
  update: {
    method: "updatePortal",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#deletePortal-property
  destroy: {
    method: "deletePortal",
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
    dependencies: {
      browserSettings,
      networkSettings,
      trustStore,
      userAccessLoggingSettings,
      userSettings,
    },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({ name, config, namespace, UserTags: tags }),
      }),
      when(
        () => browserSettings,
        defaultsDeep({
          browserSettingsArn: getField(browserSettings, "browserSettingsArn"),
        })
      ),
      when(
        () => networkSettings,
        defaultsDeep({
          networkSettingsArn: getField(networkSettings, "networkSettingsArn"),
        })
      ),
      when(
        () => trustStore,
        defaultsDeep({
          trustStoreArn: getField(trustStore, "trustStoreArn"),
        })
      ),
      when(
        () => userAccessLoggingSettings,
        defaultsDeep({
          userAccessLoggingSettingsArn: getField(
            userAccessLoggingSettings,
            "userAccessLoggingSettingsArn"
          ),
        })
      ),
      when(
        () => userSettings,
        defaultsDeep({
          userSettingsArn: getField(userSettings, "userSettingsArn"),
        })
      ),
    ])(),
});
