const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep, isIn } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./RAMCommon");

const buildArn = () =>
  pipe([
    get("permissionArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const toPermissionArn = pipe([
  tap((arn) => {
    assert(arn);
  }),
  ({ arn }) => ({ permissionArn: arn }),
]);

const pickId = pipe([
  tap(({ permissionArn }) => {
    assert(permissionArn);
  }),
  pick(["permissionArn"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({ policyTemplate }) => {
      assert(policyTemplate);
      assert(endpoint);
    }),
    toPermissionArn,
    assign({ policyTemplate: pipe([get("policyTemplate"), JSON.parse]) }),
  ]);

const filterPayload = pipe([
  tap(({ policyTemplate }) => {
    assert(policyTemplate);
  }),
  assign({
    policyTemplate: pipe([get("policyTemplate"), JSON.stringify]),
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html
exports.RAMPermission = () => ({
  type: "Permission",
  package: "ram",
  client: "RAM",
  propertiesDefault: {},
  omitProperties: [
    "permissionArn",
    "status",
    "isResourceTypeDefault",
    "lastUpdatedTime",
    "creationTime",
    "defaultVersion",
    "version",
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
      get("permissionArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["UnknownResourceException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#getPermission-property
  getById: {
    method: "getPermission",
    getField: "permission",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#listPermissions-property
  getList: {
    enhanceParams: () => () => ({ permissionType: "CUSTOMER_MANAGED" }),
    method: "listPermissions",
    getParam: "permissions",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#createPermission-property
  create: {
    filterPayload,
    method: "createPermission",
    pickCreated: ({ payload }) => pipe([get("permission")]),
    isInstanceUp: pipe([get("status"), isIn(["ATTACHABLE"])]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#createPermissionVersion-property
  update: {
    method: "createPermissionVersion",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#deletePermission-property
  destroy: {
    method: "deletePermission",
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
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
    ])(),
});
