const assert = require("assert");
const {
  tap,
  get,
  pipe,
  filter,
  not,
  eq,
  any,
  switchCase,
  pick,
  fork,
  flatMap,
} = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const { retryCall } = require("@grucloud/core/Retry");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { compareAws } = require("../AwsCommon");
const logger = require("@grucloud/core/logger")({
  prefix: "RouteTableAssociationAssociation",
});

const {
  getResourceNameFromTag,
  findDefaultWithVpcDependency,
} = require("./EC2Common");

const findId = () =>
  pipe([
    get("RouteTableAssociationId"),
    tap((id) => {
      assert(id);
    }),
  ]);

const isDefault = () => pipe([get("Associations"), any(get("Main"))]);

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      fork({
        routeTableName: pipe([
          get("RouteTableId"),
          lives.getById({
            providerName: config.providerName,
            type: "RouteTable",
            group: "EC2",
          }),
          get("name"),
          tap((name) => {
            assert(name);
          }),
        ]),
        subnetName: pipe([
          get("SubnetId"),
          lives.getById({
            providerName: config.providerName,
            type: "Subnet",
            group: "EC2",
          }),
          get("name"),
          tap((name) => {
            assert(name);
          }),
        ]),
      }),
      ({ routeTableName, subnetName }) =>
        `rt-assoc::${routeTableName}::${subnetName}`,
      tap((params) => {
        assert(true);
      }),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2RouteTableAssociation = ({ compare }) => ({
  type: "RouteTableAssociation",
  package: "ec2",
  client: "EC2",
  inferName: ({ dependenciesSpec: { routeTable, subnet } }) =>
    pipe([
      tap(() => {
        assert(routeTable);
        assert(subnet);
      }),
      () => `rt-assoc::${routeTable}::${subnet}`,
    ]),
  findName,
  findId,
  ignoreErrorCodes: ["InvalidAssociationID.NotFound"],
  compare: compareAws({
    getTargetTags: () => [],
    getLiveTags: () => [],
  })({
    filterLive: () => pipe([pick(["RouteTableId", "SubnetId"])]),
  }),
  filterLive: () => pick([]),
  dependencies: {
    routeTable: {
      type: "RouteTable",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("RouteTableId"),
    },
    subnet: {
      type: "Subnet",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("SubnetId"),
    },
  },
  isDefault,
  findDefault: findDefaultWithVpcDependency,
  managedByOther: isDefault,
  cannotBeDeleted: isDefault,
  getResourceName: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      switchCase([
        pipe([get("Associations"), any(get("Main"))]),
        pipe([() => "rt-default"]),
        getResourceNameFromTag(),
      ]),
    ]),
  omitProperties: [
    "VpcId",
    "Associations",
    "PropagatingVgws",
    "RouteTableAssociationId",
    "OwnerId",
    "Routes",
  ],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeRouteTableAssociations-property
  // getById: {
  //   pickId: pipe([
  //     tap(({ RouteTableAssociationId }) => {
  //       assert(RouteTableAssociationId);
  //     }),
  //     ({ RouteTableAssociationId }) => ({
  //       RouteTableAssociationIds: [RouteTableAssociationId],
  //     }),
  //   ]),
  //   method: "describeRouteTableAssociations",
  //   getParam: "RouteTableAssociations",
  // },
  getList:
    ({}) =>
    ({ lives, config }) =>
      pipe([
        tap(() => {
          logger.info(`getList rt assoc`);
        }),
        lives.getByType({
          type: "RouteTable",
          group: "EC2",
          providerName: config.providerName,
        }),
        flatMap(pipe([get("live.Associations"), filter(not(get("Main")))])),
      ])(),
  create:
    ({ endpoint }) =>
    ({ payload, name, dependencies, lives, resolvedDependencies }) =>
      pipe([
        tap(() => {
          logger.info(
            `create associateRouteTable ${JSON.stringify({ payload })}`
          );
        }),
        () => payload,
        endpoint().associateRouteTable,
        tap((result) => {
          logger.debug(
            `created rt assoc ${JSON.stringify({ payload, result })}`
          );
        }),
        // Refresh the route table
        tap(() =>
          retryCall({
            name: `create rt assoc: ${name}`,
            fn: pipe([
              () => ({ lives, resolvedDependencies }),
              dependencies().routeTable.getLive,
              get("Associations"),
              find(eq(get("SubnetId"), payload.SubnetId)),
              eq(get("AssociationState.State"), "associated"),
            ]),
          })
        ),
        tap(() => {
          logger.info(`rt assoc updated ${JSON.stringify({ name })}`);
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteRouteTableAssociation-property
  destroy: {
    pickId: pipe([
      tap(({ RouteTableAssociationId }) => {
        assert(RouteTableAssociationId);
      }),
      ({ RouteTableAssociationId }) => ({
        AssociationId: RouteTableAssociationId,
      }),
    ]),
    method: "disassociateRouteTable",
    ignoreErrorCodes: ["InvalidAssociationID.NotFound"],
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties = {},
    dependencies: { routeTable, subnet },
  }) =>
    pipe([
      tap(() => {
        assert(
          routeTable,
          "RouteTableAssociation is missing the dependency 'routeTable'"
        );
        assert(
          subnet,
          "RouteTableAssociation is missing the dependency 'subnet'"
        );
      }),
      () => properties,
      defaultsDeep({
        RouteTableId: getField(routeTable, "RouteTableId"),
        SubnetId: getField(subnet, "SubnetId"),
      }),
    ])(),
});
