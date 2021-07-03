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
const { findNamespaceInTags, buildTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { Ec2New, shouldRetryOnException } = require("../AwsCommon");

exports.AwsRoute = ({ spec, config }) => {
  const ec2 = Ec2New(config);

  const findId = get("name");
  const findName = findId;

  const findDependencies = ({ live }) => [
    {
      type: "RouteTable",
      ids: [live.RouteTableId],
    },
    {
      type: "InternetGateway",
      ids: filter(not(isEmpty))([live.GatewayId]),
    },
    {
      type: "NatGateway",
      ids: filter(not(isEmpty))([live.NatGatewayId]),
    },
  ];

  const getList = ({ resources, lives } = {}) =>
    pipe([
      tap(() => {
        assert(Array.isArray(resources));
        logger.info(`getList route ${resources.length}`);
      }),
      () => resources,
      map((resource) =>
        pipe([
          tap(() => {
            logger.debug(`getList resource ${resource.name}`);
          }),
          () => resource.resolveDependencies({ lives }),
          tap((resolvedDependencies) => {
            logger.debug(`getList resource ${resolvedDependencies}`);
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

  const getByName = ({ name, lives, resources }) =>
    getByNameCore({ name, getList, findName, lives, resources });

  const createRouteInternetGateway = ({ ig, RouteTableId, payload }) =>
    switchCase([
      () => ig,
      pipe([
        tap(() => {
          assert(ig.live.InternetGatewayId, "ig.live.InternetGatewayId");
        }),
        () =>
          ec2().createRoute({
            ...payload,
            RouteTableId,
            GatewayId: ig.live.InternetGatewayId,
          }),
      ]),
      () => undefined,
    ]);

  const createRouteNatGateway = ({ natGateway, RouteTableId, payload }) =>
    switchCase([
      () => natGateway,
      pipe([
        tap(() => {
          assert(natGateway.live.NatGatewayId, "natGateway.live.NatGatewayId");
        }),
        () =>
          ec2().createRoute({
            ...payload,
            RouteTableId,
            NatGatewayId: natGateway.live.NatGatewayId,
          }),
      ]),
      () => undefined,
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
