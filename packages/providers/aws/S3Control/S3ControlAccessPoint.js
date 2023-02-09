const assert = require("assert");
const { pipe, tap, get, pick, assign, tryCatch, or } = require("rubico");
const { defaultsDeep, when, unless, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { assignPolicyAccountAndRegion } = require("../IAM/AwsIamCommon");

const toAccountId = ({ BucketAccountId, ...other }) => ({
  AccountId: BucketAccountId,
  ...other,
});

const pickId = pipe([
  tap(({ Name, AccountId }) => {
    assert(Name);
    assert(AccountId);
  }),
  pick(["Name", "AccountId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toAccountId,
    (live) =>
      tryCatch(
        pipe([
          () => live,
          endpoint().getAccessPointPolicy,
          get("Policy"),
          JSON.parse,
          //TODO normalize policy
          (Policy) => ({ ...live, Policy }),
        ]),
        () => live
      )(),
  ]);

const putAccessPointPolicy = ({ endpoint }) =>
  pipe([
    pick(["Name", "AccountId", "Policy"]),
    assign({ Policy: pipe([get("Policy"), JSON.stringify]) }),
    endpoint().putAccessPointPolicy,
  ]);

const deleteAccessPointPolicy = ({ endpoint }) =>
  pipe([pickId, endpoint().deleteAccessPointPolicy]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html
exports.S3ControlAccessPoint = () => ({
  type: "AccessPoint",
  package: "s3-control",
  client: "S3Control",
  propertiesDefault: {},
  omitProperties: [
    "Alias",
    "AccountId",
    "CreationDate",
    "AccessPointArn",
    "Endpoints",
    "BucketAccountId",
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
      get("AccessPointArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NoSuchAccessPoint"],
  dependencies: {
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Bucket"),
          tap((Bucket) => {
            assert(Bucket);
          }),
        ]),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([get("VpcConfiguration.VpcId")]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("Policy"),
        assign({
          Policy: pipe([
            get("Policy"),
            assignPolicyAccountAndRegion({ lives, providerConfig }),
          ]),
        })
      ),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#getAccessPoint-property
  getById: {
    method: "getAccessPoint",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#listAccessPoints-property
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AccountId: config.accountId() }),
    method: "listAccessPoints",
    getParam: "AccessPointList",
    decorate: ({ getById }) => pipe([toAccountId, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#createAccessPoint-property
  create: {
    method: "createAccessPoint",
    pickCreated: ({ payload }) => pipe([() => payload]),
    postCreate: ({ endpoint, payload, config }) =>
      pipe([
        () => payload,
        tap.if(
          get("Policy"),
          pipe([putAccessPointPolicy({ endpoint, config })])
        ),
      ]),
  },
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => diff,
        // Policy Added/Updated
        tap.if(
          or([get("liveDiff.added.Policy"), get("liveDiff.updated.Policy")]),
          pipe([() => payload, putAccessPointPolicy({ endpoint })])
        ),
        // Policy Deleted
        tap.if(
          or([get("targetDiff.added.Policy")]),
          pipe([() => payload, deleteAccessPointPolicy({ endpoint })])
        ),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3Control.html#deleteAccessPoint-property
  destroy: {
    method: "deleteAccessPoint",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { vpc },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        AccountId: config.accountId(),
      }),
      when(
        () => vpc,
        defaultsDeep({
          VpcConfiguration: { VpcId: getField(vpc, "VpcId") },
        })
      ),
    ])(),
});
