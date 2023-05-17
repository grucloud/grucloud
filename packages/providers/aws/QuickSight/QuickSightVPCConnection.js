const assert = require("assert");
const { pipe, tap, get, pick, map } = require("rubico");
const { defaultsDeep, isIn, when, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
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
  tap(({ VPCConnectionId, AwsAccountId }) => {
    assert(VPCConnectionId);
  }),
  pick(["VPCConnectionId", "AwsAccountId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
    defaultsDeep({ AwsAccountId: config.accountId() }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
exports.QuickSightVPCConnection = () => ({
  type: "VPCConnection",
  package: "quicksight",
  client: "QuickSight",
  propertiesDefault: {},
  omitProperties: [
    "AwsAccountId",
    "VPCConnectionId",
    "Arn",
    "CreatedTime",
    "LastUpdatedTime",
    "RoleArn",
    "VPCId",
    "SecurityGroupIds",
    "Status",
    "NetworkInterfaces",
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
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("RoleArn")]),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SubnetIds"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("SecurityGroupIds"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#describeVPCConnection-property
  getById: {
    method: "describeVPCConnection",
    getField: "VPCConnection",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#listVPCConnections-property
  getList: {
    enhanceParams:
      ({ config }) =>
      () => ({ AwsAccountId: config.accountId() }),
    method: "listVPCConnections",
    getParam: "VPCConnectionSummaries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createVPCConnection-property
  create: {
    method: "createVPCConnection",
    pickCreated: ({ payload }) => pipe([identity]),
    isInstanceUp: pipe([get("Status"), isIn(["CREATION_SUCCESSFUL"])]),
    isInstanceError: pipe([get("Status"), isIn(["CREATION_FAILED"])]),
    // getErrorMessage: pipe([get("StateChangeReason.Message", "FAILED")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#updateVPCConnection-property
  update: {
    method: "updateVPCConnection",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#deleteVPCConnection-property
  destroy: {
    method: "deleteVPCConnection",
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
    dependencies: { iamRole, securityGroups, subnets },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        AwsAccountId: config.accountId(),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          RoleArn: getField(iamRole, "Arn"),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          SecurityGroupIds: pipe([
            () => securityGroups,
            map((sg) => getField(sg, "GroupId")),
          ])(),
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          SubnetIds: pipe([
            () => subnets,
            map((subnet) => getField(subnet, "SubnetId")),
          ])(),
        })
      ),
    ])(),
});
