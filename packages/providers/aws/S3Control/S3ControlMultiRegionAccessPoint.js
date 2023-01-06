const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
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
    assignArn({ config }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html
exports.S3ControlMultiRegionAccessPoint = () => ({
  type: "MultiRegionAccessPoint",
  package: "s3-control",
  client: "S3Control",
  //region: "us-west-1",
  propertiesDefault: {},
  omitProperties: [
    "AccountId",
    "CreatedAt",
    "MultiRegionAccessPointArn",
    "Status",
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
  ignoreErrorCodes: ["NoSuchMultiRegionAccessPoint"],
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
      tap(({ Details }) => {
        assert(Details);
        assert(Details.Name);
      }),
      ({ AccountId, Details }) => ({ AccountId, Name: Details.Name }),
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
    //decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#createMultiRegionAccessPoint-property
  create: {
    method: "createMultiRegionAccessPoint",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("Status"), "READY")]),
  },
  // TODO update ?
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#deleteMultiRegionAccessPoint-property
  destroy: {
    method: "deleteMultiRegionAccessPoint",
    pickId: pipe([
      tap(({ Details }) => {
        assert(Details);
      }),
      pick(["AccountId", "Details"]),
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
