const assert = require("assert");
const {
  tap,
  get,
  pipe,
  filter,
  map,
  eq,
  any,
  tryCatch,
  switchCase,
  pick,
  fork,
} = require("rubico");
const { defaultsDeep, first, callProp, last, prepend } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({ prefix: "EC2RouteTable" });
const { tos } = require("@grucloud/core/tos");

const {
  buildTags,
  findNameInTagsOrId,
  throwIfNotAwsError,
} = require("../AwsCommon");
const {
  tagResource,
  untagResource,
  getResourceNameFromTag,
  findDefaultWithVpcDependency,
} = require("./EC2Common");

const extractRouteTableName = pipe([callProp("split", "::"), last]);

const findId = () => get("RouteTableId");
const pickId = pick(["RouteTableId"]);

const isDefault = () => pipe([get("Associations"), any(get("Main"))]);

const findName = ({ lives, config }) =>
  pipe([
    fork({
      vpcName: (live) =>
        pipe([
          () => live,
          get("VpcId"),
          lives.getById({
            type: "Vpc",
            group: "EC2",
            providerName: config.providerName,
          }),
          get("name"),
          tap((name) => {
            assert(
              name,
              `no vpc name in route table id ${live.RouteTableId}, VpcId: ${live.VpcId}`
            );
          }),
        ])(),
      rtbName: switchCase([
        isDefault({ lives, config }),
        pipe([() => "rt-default"]),
        findNameInTagsOrId({ findId })({ lives, config }),
      ]),
    }),
    ({ vpcName, rtbName }) => `${vpcName}::${rtbName}`,
  ]);

const routesDelete = ({ endpoint }) =>
  tap((live) =>
    pipe([
      () => live,
      get("Routes"),
      filter(eq(get("State"), "blackhole")),
      map(
        tryCatch(
          pipe([
            tap((Route) => {
              assert(Route);
            }),
            pick(["DestinationCidrBlock", "DestinationIpv6CidrBlock"]),
            defaultsDeep({ RouteTableId: live.RouteTableId }),
            tryCatch(
              endpoint().deleteRoute,
              throwIfNotAwsError("InvalidRoute.NotFound")
            ),
          ]),
          (error, Route) =>
            pipe([
              tap(() => {
                logger.error(`error deleteRoute ${tos({ Route, error })}`);
              }),
              () => ({ error, Route }),
            ])()
        )
      ),
      tap.if(any(get("error")), (result) => {
        throw result;
      }),
    ])()
  );

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2RouteTable = ({ compare }) => ({
  type: "RouteTable",
  package: "ec2",
  client: "EC2",
  inferName:
    ({ resourceName, dependenciesSpec: { vpc } }) =>
    () =>
      pipe([
        tap((params) => {
          assert(vpc);
          assert(resourceName);
        }),
        () => resourceName,
        callProp("split", "::"),
        last,
        prepend("::"),
        prepend(vpc),
      ])(),
  findName,
  findId,
  ignoreErrorCodes: ["InvalidRouteTableID.NotFound"],
  isDefault,
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
    "RouteTableId",
    "OwnerId",
    "Routes",
  ],
  findDefault: findDefaultWithVpcDependency,
  filterLive: () => pick([]),
  dependencies: {
    vpc: {
      type: "Vpc",
      group: "EC2",
      parent: true,
      dependencyId: ({ lives, config }) => get("VpcId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeRouteTables-property
  getById: {
    pickId: pipe([
      tap(({ RouteTableId }) => {
        assert(RouteTableId);
      }),
      ({ RouteTableId }) => ({ RouteTableIds: [RouteTableId] }),
    ]),
    method: "describeRouteTables",
    getParam: "RouteTables",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeRouteTables-property
  getList: {
    method: "describeRouteTables",
    getParam: "RouteTables",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRouteTable-property
  create: {
    method: "createRouteTable",
    pickCreated: () => get("RouteTable"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteRouteTable-property
  destroy: {
    pickId,
    preDestroy: routesDelete,
    method: "deleteRouteTable",
  },
  getByName:
    ({ endpoint }) =>
    ({ name, isDefault, resolvedDependencies }) =>
      pipe([
        tap((params) => {
          assert(resolvedDependencies);
        }),
        () => resolvedDependencies,
        switchCase([
          get("vpc"),
          get("vpc.live.VpcId"),
          get("routeTable"),
          get("routeTable.live.VpcId"),
          () => {
            assert(false, "no vpc or route table dependencies");
          },
        ]),
        tap((VpcId) => {
          assert(VpcId);
        }),
        fork({
          filterName: switchCase([
            () => isDefault,
            () => ({ Name: "association.main", Values: [true] }),
            () => ({ Name: "tag:Name", Values: [extractRouteTableName(name)] }),
          ]),
          filterVpc: (VpcId) => ({
            Name: "vpc-id",
            Values: [VpcId],
          }),
        }),
        ({ filterName, filterVpc }) => ({ Filters: [filterName, filterVpc] }),
        endpoint().describeRouteTables,
        get("RouteTables"),
        first,
      ])(),
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otheProps },
    dependencies: { vpc },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(vpc, "RouteTable is missing the dependency 'vpc'");
      }),
      () => otheProps,
      defaultsDeep({
        VpcId: getField(vpc, "VpcId"),
        TagSpecifications: [
          {
            ResourceType: "route-table",
            Tags: buildTags({
              config,
              namespace,
              name: extractRouteTableName(name),
              UserTags: Tags,
            }),
          },
        ],
      }),
    ])(),
});
