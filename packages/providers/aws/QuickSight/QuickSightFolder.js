const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, identity, pluck } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./QuickSightCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ FolderId, AwsAccountId }) => {
    assert(FolderId);
    assert(AwsAccountId);
  }),
  pick(["FolderId", "AwsAccountId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeFolderPermissions-property
    assign({
      Permissions: pipe([
        pickId,
        endpoint().describeFolderPermissions,
        get("Permissions"),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightFolder = () => ({
  type: "Folder",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "CreatedTime",
    "LastUpdatedTime",
    "Version",
    "AwsAccountId",
    "ParentFolderArn",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("FolderId"),
      tap((id) => {
        assert(id);
      }),
    ]),

  ignoreErrorCodes: [
    "ResourceNotFoundException",
    "UnsupportedUserEditionException",
  ],
  dependencies: {
    groups: {
      type: "Group",
      group: "QuickSight",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("Permissions"), pluck("Principal")]),
    },
    // TODO parent_folder_arn
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeFolder-property
  getById: {
    method: "describeFolder",
    getField: "Folder",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listFolders-property
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AwsAccountId: config.accountId() }),
    method: "listFolders",
    getParam: "Folders",
    decorate,
    ignoreErrorCodes: ["UnsupportedUserEditionException"],
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createFolder-property
  create: {
    method: "createFolder",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateFolder-property
  update: {
    method: "updateFolder",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteFolder-property
  destroy: {
    method: "deleteFolder",
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
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        AwsAccountId: config.accountId(),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
