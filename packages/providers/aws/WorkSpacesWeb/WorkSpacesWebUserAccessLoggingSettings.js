const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const {
  Tagger,
  assignTags,
  associate,
  disassociate,
} = require("./WorkSpacesWebCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const buildArn = () =>
  pipe([
    get("userAccessLoggingSettingsArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ userAccessLoggingSettingsArn }) => {
    assert(userAccessLoggingSettingsArn);
  }),
  pick(["userAccessLoggingSettingsArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html
exports.WorkSpacesWebUserAccessLoggingSettings = () => ({
  type: "UserAccessLoggingSettings",
  package: "workspaces-web",
  client: "WorkSpacesWeb",
  propertiesDefault: {},
  omitProperties: [
    "userAccessLoggingSettingsArn",
    "associatedPortalArns",
    "kinesisStreamArn",
  ],
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
      get("userAccessLoggingSettingsArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    kinesisStream: {
      type: "Stream",
      group: "Kinesis",
      dependencyId: ({ lives, config }) => pipe([get("kinesisStreamArn")]),
    },
    portals: {
      type: "Portal",
      group: "WorkSpacesWeb",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("associatedPortalArns")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#getUserAccessLoggingSettings-property
  getById: {
    method: "getUserAccessLoggingSettings",
    getField: "userAccessLoggingSettings",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#listUserAccessLoggingSettingss-property
  getList: {
    method: "listUserAccessLoggingSettings",
    getParam: "userAccessLoggingSettings",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#createUserAccessLoggingSettings-property
  create: {
    method: "createUserAccessLoggingSettings",
    pickCreated: ({ payload }) => pipe([identity]),
    postCreate: ({ endpoint, resolvedDependencies: { portals } }) =>
      pipe([
        associate({
          endpoint,
          portals,
          method: "associateUserAccessLoggingSettings",
          arnKey: "userAccessLoggingSettingsArn",
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#updateUserAccessLoggingSettings-property
  update: {
    method: "updateUserAccessLoggingSettings",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/WorkSpacesWeb.html#deleteUserAccessLoggingSettings-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap(
        disassociate({
          endpoint,
          method: "disassociateUserAccessLoggingSettings",
        })
      ),
    method: "deleteUserAccessLoggingSettings",
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
    dependencies: { kinesisStream },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({ name, config, namespace, UserTags: tags }),
      }),
      when(
        () => kinesisStream,
        defaultsDeep({ kinesisStreamArn: getField(kinesisStream, "StreamARN") })
      ),
    ])(),
});
