const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
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
    get("userSettingsArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ userSettingsArn }) => {
    assert(userSettingsArn);
  }),
  pick(["userSettingsArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html
exports.WorkSpacesWebUserSettings = () => ({
  type: "UserSettings",
  package: "workspaces-web",
  client: "WorkSpacesWeb",
  propertiesDefault: {},
  omitProperties: ["userSettingsArn", "associatedPortalArns"],
  // TODO
  inferName:
    ({}) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => "default",
      ])(),
  // TODO
  findName:
    ({ lives, config }) =>
    ({}) =>
      pipe([
        tap(() => {
          assert(true);
        }),
        () => "default",
      ])(),
  findId: () =>
    pipe([
      get("userSettingsArn"),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#getUserSettings-property
  getById: {
    method: "getUserSettings",
    getField: "userSettings",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#listUserSettingss-property
  getList: {
    method: "listUserSettings",
    getParam: "userSettings",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#createUserSettings-property
  create: {
    method: "createUserSettings",
    pickCreated: ({ payload }) => pipe([identity]),
    postCreate: ({ endpoint, resolvedDependencies: { portals } }) =>
      pipe([
        associate({
          endpoint,
          portals,
          method: "associateUserSettings",
          arnKey: "userSettingsArn",
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#updateUserSettings-property
  update: {
    method: "updateUserSettings",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#deleteUserSettings-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap(disassociate({ endpoint, method: "disassociateUserSettings" })),
    method: "deleteUserSettings",
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
