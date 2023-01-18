const assert = require("assert");
const { pipe, tap, get, pick, assign, eq } = require("rubico");
const { defaultsDeep, prepend, pluck } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { arnFromId } = require("../AwsCommon");

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        get("Alias"),
        prepend("accesspoint/"),
        arnFromId({ service: "s3", config }),
      ]),
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep({ AccountId: config.accountId() }),
    assignArn({ config }),
  ]);

const filterPayload = pipe([
  ({ AccountId, ...Details }) => ({ AccountId, Details }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html
exports.S3ControlMultiRegionAccessPoint = () => ({
  type: "MultiRegionAccessPoint",
  package: "s3-control",
  client: "S3Control",
  //region: "us-west-1",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "AccountId",
    "CreatedAt",
    "MultiRegionAccessPointArn",
    "Status",
    "Alias",
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
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["PermanentRedirect", "NoSuchMultiRegionAccessPoint"],
  dependencies: {
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Regions"),
          pluck("Bucket"),
          tap((Buckets) => {
            assert(Buckets);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#getMultiRegionAccessPoint-property
  getById: {
    method: "getMultiRegionAccessPoint",
    pickId: pipe([
      tap(({ Name }) => {
        assert(Name);
      }),
      pick(["AccountId", "Name"]),
    ]),
    getField: "AccessPoint",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#listMultiRegionAccessPoints-property
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AccountId: config.accountId() }),
    method: "listMultiRegionAccessPoints",
    getParam: "AccessPoints",
    decorate: ({ getById, config }) =>
      pipe([({ Name }) => ({ AccountId: config.accountId(), Name }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#createMultiRegionAccessPoint-property
  create: {
    filterPayload,
    method: "createMultiRegionAccessPoint",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("Status"), "READY")]),
  },
  // TODO update ?
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#deleteMultiRegionAccessPoint-property
  destroy: {
    method: "deleteMultiRegionAccessPoint",
    pickId: pipe([
      tap(({ Name, AccountId }) => {
        assert(AccountId);
        assert(Name);
      }),
      ({ AccountId, Name }) => ({ AccountId, Details: { Name } }),
    ]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        AccountId: config.accountId(),
      }),
    ])(),
});
