const assert = require("assert");
const {
  tap,
  get,
  pipe,
  filter,
  map,
  not,
  and,
  or,
  eq,
  fork,
  switchCase,
  tryCatch,
  pick,
  assign,
  flatMap,
} = require("rubico");
const {
  isEmpty,
  defaultsDeep,
  find,
  unless,
  append,
  callProp,
  when,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AwsRoute" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");

const { findNamespaceInTags, buildTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const { createEC2 } = require("./EC2Common");

exports.EC2Route = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const findId = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(live.RouteTableId);
        assert(lives);
      }),
      () =>
        lives.getById({
          type: "RouteTable",
          group: "EC2",
          providerName: config.providerName,
          id: live.RouteTableId,
        }),
      tap((routeTable) => {
        //assert(routeTable);
      }),
      get("name", "no-route-table-id"),
      switchCase([
        () => live.NatGatewayId,
        append("-nat-gateway"),
        eq(live.GatewayId, "local"),
        append("-local"),
        pipe([() => live.GatewayId, callProp("startsWith", "igw-")]),
        append("-igw"),
        pipe([() => live.GatewayId, callProp("startsWith", "vpce-")]),
        append("-vpce"),
        append(`-${live.DestinationCidrBlock}`),
      ]),
      tap((params) => {
        assert(true);
      }),
    ])();

  const findName = (params) => {
    const fns = [get("live.name"), findId];
    for (fn of fns) {
      const name = fn(params);
      if (!isEmpty(name)) {
        return name;
      }
    }
    assert(false, "should have a name");
  };

  const isDefault = ({ live, lives }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => live,
      eq(get("GatewayId"), "local"),
    ])();

  const findDependencies = ({ live, lives }) => [
    {
      type: "RouteTable",
      group: "EC2",
      ids: [live.RouteTableId],
    },
    {
      type: "InternetGateway",
      group: "EC2",
      //must start with igw-
      ids: [
        pipe([
          () =>
            lives.getById({
              id: live.GatewayId,
              type: "InternetGateway",
              group: "EC2",
              providerName: config.providerName,
            }),
          get("id"),
        ])(),
      ],
    },
    {
      type: "VpcEndpoint",
      group: "EC2",
      ids: [
        pipe([
          () =>
            lives.getById({
              id: live.GatewayId,
              type: "VpcEndpoint",
              group: "EC2",
              providerName: config.providerName,
            }),
          get("id"),
        ])(),
      ],
    },
    {
      type: "NatGateway",
      group: "EC2",
      ids: [live.NatGatewayId],
    },
  ];

  const getListFromTarget = ({ resources, lives } = {}) =>
    pipe([
      tap(() => {
        assert(Array.isArray(resources));
        logger.info(`getList #routes ${resources.length}`);
      }),
      () => resources,
      map((resource) =>
        pipe([
          tap(() => {
            logger.debug(`getList resource ${resource.name}`);
          }),
          () => resource.resolveDependencies({ lives }),
          tap((resolvedDependencies) => {
            logger.debug(
              `getList route resolvedDependencies ${tos(resolvedDependencies)}`
            );
          }),
          ({ routeTable, ig, natGateway }) =>
            switchCase([
              () => isEmpty(routeTable.live),
              () => null,
              tryCatch(
                pipe([
                  () => routeTable.live.Routes,
                  find(
                    or([
                      and([
                        () => !isEmpty(ig?.live?.InternetGatewayId),
                        eq(get("GatewayId"), ig?.live?.InternetGatewayId),
                      ]),
                      and([
                        () => !isEmpty(natGateway?.live?.NatGatewayId),
                        eq(get("NatGatewayId"), natGateway?.live?.NatGatewayId),
                      ]),
                    ])
                  ),
                  switchCase([
                    not(isEmpty),
                    assign({
                      name: () => resource.name,
                      RouteTableId: () => routeTable.live.RouteTableId,
                      Tags: () =>
                        buildTags({
                          config,
                          namespace: findNamespaceInTags(config)({
                            live: routeTable.live,
                          }),
                          name: resource.name,
                        }),
                    }),
                    () => undefined,
                  ]),
                ]),
                (error, params) => ({
                  error,
                  params,
                })
              ),
            ])(),
        ])()
      ),
      filter(not(isEmpty)),
    ])();

  const getListFromLive = ({ lives }) =>
    pipe([
      tap(() => {
        logger.debug(`getListFromLive`);
      }),
      () =>
        lives.getByType({
          type: "RouteTable",
          group: "EC2",
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
                  assign({
                    RouteTableId: () => RouteTableId,
                    //Tags: () => Tags,
                  }),
                ])
              ),
            ])(),
        ])()
      ),
      tap((params) => {
        assert(true);
      }),
      filter(not(isEmpty)),
    ])();

  const isRouteEqual = (live, target) =>
    pipe([
      tap((params) => {
        assert(live);
        assert(target);
      }),
      and([
        eq(live.RouteTableId, target.RouteTableId),
        eq(live.DestinationCidrBlock, target.DestinationCidrBlock),
        or([
          eq(live.GatewayId, target.GatewayId),
          eq(live.NatGatewayId, target.NatGatewayId),
        ]),
      ]),
      tap((params) => {
        assert(true);
      }),
    ])();

  const getList = pipe([
    tap((params) => {
      assert(true);
    }),
    getListFromLive,
  ]);

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
      tap((RouteTableId) => {
        logger.info(`Refresh the route table ${RouteTableId}`);
      }),
      // Refresh the route table
      tap(() => dependencies().routeTable.getLive({ lives })),
      tap((RouteTableId) => {
        logger.info(`created route ${tos({ name, RouteTableId })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteRoute-property
  const destroy = client.destroy({
    pickId: pick([
      "DestinationCidrBlock",
      "RouteTableId",
      "DestinationIpv6CidrBlock",
      "DestinationPrefixListId",
    ]),
    method: "deleteRoute",
    //TODO
    //getById,
    ignoreErrorCodes: ["InvalidRoute.NotFound"],
    config,
  });

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
    isDefault,
    managedByOther: isDefault,
    cannotBeDeleted: isDefault,
  };
};
