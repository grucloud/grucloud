const assert = require("assert");
const {
  tap,
  get,
  pipe,
  filter,
  map,
  not,
  eq,
  fork,
  switchCase,
  tryCatch,
  pick,
  assign,
  flatMap,
} = require("rubico");
const { isEmpty, defaultsDeep, find, unless, append } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AwsRoute" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");

const { findNamespaceInTags, buildTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { Ec2New, shouldRetryOnException } = require("../AwsCommon");

exports.EC2Route = ({ spec, config }) => {
  const ec2 = Ec2New(config);

  const findId = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () =>
        lives.getById({
          type: "RouteTable",
          group: "ec2",
          providerName: config.providerName,
          id: live.RouteTableId,
        }),
      tap((routeTable) => {
        assert(routeTable);
      }),
      get("name"),
      switchCase([
        not(eq(live.GatewayId, "local")),
        append("-igw"),
        eq(live.GatewayId, "local"),
        append("-local"),
        () => live.NatGatewayId,
        append("-nat-gateway"),
        append(`-${live.DestinationCidrBlock}`),
      ]),
      tap((params) => {
        assert(true);
      }),
    ])();

  const findName = findId;

  const isDefault = ({ live, lives }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => live,
      eq(get("GatewayId"), "local"),
    ])();

  const findDependencies = ({ live }) => [
    {
      type: "RouteTable",
      group: "ec2",
      ids: [live.RouteTableId],
    },
    {
      type: "InternetGateway",
      group: "ec2",
      ids: [live.GatewayId],
    },
    {
      type: "NatGateway",
      group: "ec2",
      ids: [live.NatGatewayId],
    },
  ];

  const getList = ({ resources, lives }) =>
    pipe([
      tap(() => {
        assert(Array.isArray(resources));
      }),
      () =>
        lives.getByType({
          type: "RouteTable",
          group: "ec2",
          providerName: config.providerName,
        }),
      flatMap((resource) =>
        pipe([
          tap(() => {
            logger.debug(`getList resource ${resource.name}`);
          }),
          () => resource,
          get("live"),
          ({ Routes, Tags, RouteTableId }) =>
            pipe([
              tap(() => {
                assert(Routes);
                assert(RouteTableId);
              }),
              () => Routes,
              map(
                pipe([
                  pick(["DestinationCidrBlock", "GatewayId", "NatGatewayId"]),
                  assign({
                    RouteTableId: () => RouteTableId,
                    Tags: () => Tags,
                  }),
                ])
              ),
              tap((params) => {
                assert(true);
              }),
            ])(),
        ])()
      ),
      tap((params) => {
        assert(true);
      }),
      filter(not(isEmpty)),
    ])();

  const getByName = getByNameCore({ getList, findName });

  const createRouteInternetGateway = ({ ig, RouteTableId, payload }) =>
    pipe([
      tap(() => {
        assert(RouteTableId);
      }),
      () => ig,
      get("live.InternetGatewayId"),
      unless(isEmpty, (GatewayId) =>
        pipe([
          () => ({
            ...payload,
            RouteTableId,
            GatewayId,
          }),
          ec2().createRoute,
          () =>
            retryCall({
              name: `createRouteInternetGateway: GatewayId: ${GatewayId}`,
              fn: pipe([
                () =>
                  ec2().describeRouteTables({
                    RouteTableIds: [RouteTableId],
                  }),
                get("RouteTables"),
                find(
                  pipe([get("Routes"), find(eq(get("GatewayId"), GatewayId))])
                ),
              ]),
              config,
            }),
        ])()
      ),
    ]);

  const createRouteNatGateway = ({ natGateway, RouteTableId, payload }) =>
    pipe([
      () => natGateway,
      get("live.NatGatewayId"),
      unless(isEmpty, (NatGatewayId) =>
        pipe([
          () =>
            ec2().createRoute({
              ...payload,
              RouteTableId,
              NatGatewayId,
            }),
          () =>
            retryCall({
              name: `createRouteNatGateway: NatGatewayId: ${NatGatewayId}`,
              fn: pipe([
                () =>
                  ec2().describeRouteTables({
                    RouteTableIds: [RouteTableId],
                  }),
                get("RouteTables"),
                find(
                  pipe([
                    get("Routes"),
                    find(eq(get("NatGatewayId"), NatGatewayId)),
                  ])
                ),
              ]),
              config,
            }),
        ])()
      ),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRoute-property
  const create = ({
    payload,
    name,
    dependencies,
    resolvedDependencies: { routeTable, ig, natGateway },
    lives,
  }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`create route ${tos({ name })}`);
        assert(dependencies);
        assert(dependencies().routeTable);

        assert(routeTable, "Route is missing the dependency 'routeTable'");
        assert(routeTable.live.RouteTableId, "routeTable.live.RouteTableId");
        assert(
          ig || natGateway,
          "Route needs the dependency 'ig', or 'natGateway'"
        );
      }),
      () => routeTable.live.RouteTableId,
      tap((RouteTableId) =>
        pipe([
          fork({
            GatewayId: createRouteInternetGateway({
              ig,
              RouteTableId,
              payload,
            }),
            NatGatewayId: createRouteNatGateway({
              natGateway,
              RouteTableId,
              payload,
            }),
          }),
        ])()
      ),
      // Refresh the route table
      () => dependencies().routeTable.getLive({ lives }),
      tap((RouteTableId) => {
        logger.info(`created route ${tos({ name, RouteTableId })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteRoute-property
  const destroy = async ({ id, name, live }) =>
    pipe([
      tap(() => {
        logger.info(`destroy route ${JSON.stringify({ live })}`);
      }),
      () => live,
      pick([
        "DestinationCidrBlock",
        "RouteTableId",
        "DestinationIpv6CidrBlock",
        "DestinationPrefixListId",
      ]),
      tap(
        ({ DestinationCidrBlock, DestinationIpv6CidrBlock, RouteTableId }) => {
          assert(DestinationCidrBlock || DestinationIpv6CidrBlock);
          assert(RouteTableId);
        }
      ),
      tryCatch(ec2().deleteRoute, (error, params) =>
        pipe([
          tap(() => {
            logger.error(`deleteRoute ${tos({ params, error })}`);
          }),
          () => error,
          switchCase([
            eq(get("code"), "InvalidRoute.NotFound"),
            () => undefined,
            () => {
              throw error;
            },
          ]),
        ])()
      ),
    ])();

  const configDefault = ({ name, namespace, properties = {} }) =>
    pipe([
      () => properties,
      defaultsDeep({
        DestinationCidrBlock: "0.0.0.0/0",
      }),
    ])();

  return {
    spec,
    findId,
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    getByName,
    findName,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
    isDefault,
    managedByOther: isDefault,
    cannotBeDeleted: isDefault,
  };
};
