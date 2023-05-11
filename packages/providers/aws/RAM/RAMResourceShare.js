const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  filter,
  not,
  assign,
  map,
} = require("rubico");
const { defaultsDeep, first, pluck } = require("rubico/x");

const { replaceWithName, omitIfEmpty } = require("@grucloud/core/Common");

const { buildTags } = require("../AwsCommon");
const { Tagger, managedByOtherAccount } = require("./RAMCommon");

const buildArn = () =>
  pipe([
    get("resourceShareArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  pick(["resourceShareArn"]),
  tap(({ resourceShareArn }) => {
    assert(resourceShareArn);
  }),
]);
const isDeleted = pipe([eq(get("status"), "DELETED")]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({ resourceShareArn }) => {
      assert(endpoint);
      assert(config);
      assert(resourceShareArn);
    }),
    assign({
      permissionArns: pipe([
        pickId,
        endpoint().listResourceSharePermissions,
        get("permissions"),
        filter(eq(get("permissionType"), "CUSTOMER_MANAGED")),
        pluck("arn"),
      ]),
    }),
    omitIfEmpty(["permissionArns"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html
exports.RAMResourceShare = ({}) => ({
  type: "ResourceShare",
  package: "ram",
  client: "RAM",
  inferName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
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
      get("resourceShareArn"),
      tap((resourceShareArn) => {
        assert(resourceShareArn);
      }),
    ]),
  managedByOther: managedByOtherAccount,
  cannotBeDeleted: managedByOtherAccount,
  ignoreErrorCodes: ["UnknownResourceException"],
  omitProperties: [
    "creationTime",
    "lastUpdatedTime",
    "owningAccountId",
    "resourceShareArn",
    "status",
  ],
  propertiesDefault: { allowExternalPrincipals: false },
  dependencies: {
    permissions: {
      type: "Permissions",
      group: "RAM",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("permissionArns")]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("permissionArns"),
        assign({
          permissionArns: pipe([
            get("permissionArns"),
            map(
              replaceWithName({
                groupType: "RAM::Permission",
                path: "id",
                providerConfig,
                lives,
              })
            ),
          ]),
        })
      ),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#getResourceShares-property
  getById: {
    method: "getResourceShares",
    getField: "resourceShares",
    pickId: pipe([
      tap(({ resourceShareArn }) => {
        assert(resourceShareArn);
      }),
      ({ resourceShareArn }) => ({
        resourceShareArns: [resourceShareArn],
        resourceOwner: "SELF",
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#getResourceShares-property
  getList: {
    enhanceParams: () => () => ({ resourceOwner: "SELF" }),
    method: "getResourceShares",
    getParam: "resourceShares",
    transformListPre: () => pipe([filter(not(isDeleted))]),
    decorate: ({ endpoint, config }) => pipe([decorate({ endpoint, config })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#createResourceShare-property
  create: {
    method: "createResourceShare",
    pickCreated: ({ payload }) => pipe([get("resourceShare")]),
    isInstanceUp: pipe([eq(get("status"), "ACTIVE")]),
    isInstanceError: pipe([eq(get("status"), "FAILED")]),
    getErrorMessage: get("statusMessage", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#updateResourceShare-property
  update: {
    method: "updateResourceShare",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#deleteResourceShare-property
  destroy: {
    method: "deleteResourceShare",
    pickId,
    isInstanceDown: isDeleted,
  },
  getByName: ({ getList, endpoint }) =>
    pipe([
      ({ name }) => ({
        name,
        resourceShareStatus: "ACTIVE",
        resourceOwner: "SELF",
      }),
      endpoint().getResourceShares,
      get("resourceShares"),
      first,
    ]),
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
        name: name,
        tags: buildTags({
          name,
          config,
          namespace,
          userTags: tags,
          key: "key",
          value: "value",
        }),
      }),
    ])(),
});
