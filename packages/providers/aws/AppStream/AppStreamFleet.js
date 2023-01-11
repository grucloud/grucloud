const assert = require("assert");
const { pipe, tap, get, assign, map, pick, eq, fork, omit } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");
const { retryCall } = require("@grucloud/core/Retry");

const { Tagger, assignTags } = require("./AppStreamCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate =
  ({ endpoint, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(endpoint);
      }),
      () => live,
      JSON.stringify,
      JSON.parse,
      omitIfEmpty(["FleetErrors"]),
      assign({
        ApplicationFleetAssociations: pipe([
          ({ Name }) => ({ FleetName: Name }),
          endpoint().describeApplicationFleetAssociations,
          get("ApplicationFleetAssociations"),
          pluck("ApplicationArn"),
        ]),
      }),
      ({ ComputeCapacityStatus, ...other }) => ({
        ComputeCapacity: { DesiredInstances: ComputeCapacityStatus.Desired },
        ...other,
      }),
      assignTags({ endpoint, buildArn: buildArn() }),
    ])();

const associateApplicationFleet =
  ({ endpoint }) =>
  ({ Name, ApplicationFleetAssociations = [] }) =>
    pipe([
      tap((params) => {
        assert(Name);
      }),
      () => ApplicationFleetAssociations,
      map(
        pipe([
          (ApplicationArn) => ({ ApplicationArn, FleetName: Name }),
          endpoint().associateApplicationFleet,
        ])
      ),
    ])();

const disassociateApplicationFleet =
  ({ endpoint }) =>
  ({ Name, ApplicationFleetAssociations = [] }) =>
    pipe([
      tap((params) => {
        assert(Name);
      }),
      () => ApplicationFleetAssociations,
      map(
        pipe([
          (ApplicationArn) => ({ ApplicationArn, FleetName: Name }),
          endpoint().disassociateApplicationFleet,
        ])
      ),
    ])();

const isInstanceUp = pipe([eq(get("State"), "RUNNING")]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html
exports.AppStreamFleet = () => ({
  type: "Fleet",
  package: "appstream",
  client: "AppStream",
  propertiesDefault: {
    EnableDefaultInternetAccess: false,
    DisconnectTimeoutInSeconds: 900,
    IdleDisconnectTimeoutInSeconds: 900,
    MaxUserDurationInSeconds: 57600,
  },
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
      get("Name"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: [
    "Arn",
    "CreatedTime",
    "IamRoleArn",
    "VpcConfig",
    "ComputeCapacityStatus",
    "State",
    "ApplicationFleetAssociations",
    "ImageArn",
  ],
  dependencies: {
    applications: {
      type: "Application",
      group: "AppStream",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("ApplicationFleetAssociations")]),
    },
    iamRole: {
      type: "Role",
      group: "IAM",
      dependsOnTypeOnly: true,
      dependencyId: ({ lives, config }) => pipe([get("IamRoleArn")]),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcConfig.SecurityGroupIds"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => get("VpcConfig.SubnetIds"),
    },
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        get("SessionScriptS3Location.S3Bucket"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeFleets-property
  getById: {
    method: "describeFleets",
    getField: "Fleets",
    pickId: pipe([
      tap(({ Name }) => {
        assert(Name);
      }),
      ({ Name }) => ({ Names: [Name] }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#describeFleets-property
  getList: {
    method: "describeFleets",
    getParam: "Fleets",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#createFleet-property
  create: {
    method: "createFleet",
    pickCreated: ({ payload }) => pipe([get("Fleet")]),
    shouldRetryOnExceptionMessages: [
      "AppStream 2.0 encountered an error because your service role",
    ],
    postCreate:
      ({ endpoint, payload, getById }) =>
      (live) =>
        pipe([
          tap((params) => {
            assert(getById);
          }),
          // startFleet
          () => payload,
          pickId,
          endpoint().startFleet,
          // isInstanceUp ?
          () =>
            retryCall({
              name: `describeFleets isInstanceUp`,
              fn: pipe([() => payload, getById, isInstanceUp]),
            }),
          // associateApplicationFleet
          () => payload,
          associateApplicationFleet({ endpoint, live }),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#updateFleet-property
  update: {
    method: "updateFleet",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppStream.html#deleteFleet-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      fork({
        disassociate: disassociateApplicationFleet({ endpoint }),
        stopFleet: pipe([pickId, endpoint().stopFleet]),
      }),
    method: "deleteFleet",
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
    dependencies: { applications, iamRole, securityGroups, subnets },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
      when(
        () => applications,
        defaultsDeep({
          ApplicationFleetAssociations: pipe([
            () => applications,
            map((app) => getField(app, "Arn")),
          ])(),
        })
      ),
      when(
        () => iamRole,
        defaultsDeep({
          IamRoleArn: getField(iamRole, "Arn"),
        })
      ),
      when(
        () => securityGroups,
        defaultsDeep({
          VpcConfig: {
            SecurityGroupIds: pipe([
              () => securityGroups,
              map((sg) => getField(sg, "GroupId")),
            ])(),
          },
        })
      ),
      when(
        () => subnets,
        defaultsDeep({
          VpcConfig: {
            SubnetIds: pipe([
              () => subnets,
              map((subnet) => getField(subnet, "SubnetId")),
            ])(),
          },
        })
      ),
    ])(),
});
