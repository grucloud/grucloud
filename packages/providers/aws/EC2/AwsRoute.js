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
  or,
  and,
  assign,
} = require("rubico");
const { isEmpty, defaultsDeep, find } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AwsRoute" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");

const { findNamespaceInTags, buildTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { Ec2New, shouldRetryOnException } = require("../AwsCommon");

exports.AwsRoute = ({ spec, config }) => {
  const ec2 = Ec2New(config);

  const findId = pipe([
    tap((params) => {
      assert(true);
    }),
    get("live.name"),
    tap(isEmpty, () => {
      logger.error("route findId cannot find name");
    }),
  ]);
  const findName = findId;

  const findDependencies = ({ live }) => [
    {
      type: "RouteTable",
      group: "ec2",
      ids: [live.RouteTableId],
    },
    {
      type: "InternetGateway",
      group: "ec2",
      ids: filter(not(isEmpty))([live.GatewayId]),
    },
    {
      type: "NatGateway",
      group: "ec2",
      ids: filter(not(isEmpty))([live.NatGatewayId]),
    },
  ];

  const getList = ({ resources, lives } = {}) =>
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
      tap((items) => {
        logger.debug(`getList route result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #route ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  const createRouteInternetGateway = ({ ig, RouteTableId, payload }) =>
    pipe([
      () => ig,
      get("live.InternetGatewayId"),
      //TODO ribico unless
      switchCase([
        isEmpty,
        () => undefined,
        (GatewayId) =>
          pipe([
            () =>
              ec2().createRoute({
                ...payload,
                RouteTableId,
                GatewayId,
              }),
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
          ])(),
      ]),
    ]);

  const createRouteNatGateway = ({ natGateway, RouteTableId, payload }) =>
    pipe([
      () => natGateway,
      get("live.NatGatewayId"),
      //TODO ribico unless
      switchCase([
        isEmpty,
        () => undefined,
        (NatGatewayId) =>
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
          ])(),
      ]),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRouteTable-property
  const create = async ({
    payload,
    name,
    resolvedDependencies: { routeTable, ig, natGateway },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create route ${tos({ name })}`);
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
        logger.info(`created route ${tos({ name, RouteTableId })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateRouteTable-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy route ${JSON.stringify({ name, id })}`);
      }),
      () => ({
        id,
      }),
    ])();

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({ DestinationCidrBlock: "0.0.0.0/0" })(properties);

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
  };
};
