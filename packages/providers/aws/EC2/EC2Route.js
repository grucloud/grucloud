const assert = require("assert");
const {
  tap,
  get,
  pipe,
  filter,
  map,
  not,
  eq,
  switchCase,
  pick,
  assign,
  flatMap,
} = require("rubico");
const {
  isEmpty,
  defaultsDeep,
  find,
  first,
  append,
  callProp,
  when,
} = require("rubico/x");

const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({ prefix: "AwsRoute" });

const { findNamespaceInTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const { createEC2 } = require("./EC2Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const ignoreErrorCodes = ["InvalidRoute.NotFound"];

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
        pipe([
          () => live,
          get("GatewayId", ""),
          callProp("startsWith", "igw-"),
        ]),
        append("-igw"),
        pipe([
          () => live,
          get("GatewayId", ""),
          callProp("startsWith", "vpce-"),
        ]),
        append("-vpce"),
        append(`-${live.DestinationCidrBlock}`),
      ]),
      tap((params) => {
        assert(true);
      }),
    ])();

  const findName = (params) => {
    const fns = [findId];
    for (fn of fns) {
      const name = fn(params);
      if (!isEmpty(name)) {
        return name;
      }
    }
    assert(false, "should have a name");
  };

  const isDefault = ({ live, lives }) =>
    pipe([() => live, eq(get("GatewayId"), "local")])();

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

  const findRoute = ({ GatewayId, NatGatewayId }) =>
    pipe([
      get("Routes"),
      tap((Routes) => {
        assert(Routes);
      }),
      find(
        pipe([
          switchCase([
            () => GatewayId,
            eq(get("GatewayId"), GatewayId),
            () => NatGatewayId,
            eq(get("NatGatewayId"), NatGatewayId),
            () => {
              assert(false, "missing route destination");
            },
          ]),
        ])
      ),
    ]);

  const getById = client.getById({
    pickId: pipe([
      tap(({ RouteTableId }) => {
        assert(RouteTableId);
      }),
      ({ RouteTableId }) => ({
        RouteTableIds: [RouteTableId],
      }),
    ]),
    method: "describeRouteTables",
    getField: "RouteTables",
    decorate: findRoute,
    ignoreErrorCodes,
  });

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
          ({ Routes, RouteTableId }) =>
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
                  }),
                ])
              ),
            ])(),
        ])()
      ),
      filter(not(isEmpty)),
    ])();

  const getList = pipe([getListFromLive]);

  const getByName = pipe([
    tap((params) => {
      assert(true);
    }),
    getByNameCore({ getList, findName }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRoute-property
  // Create vpc endpoint route with https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifyVpcEndpoint-property

  const createRouteVpcEndpoint = ({
    name,
    payload: { VpcEndpointId, RouteTableId },
    dependencies,
    lives,
  }) =>
    pipe([
      tap((params) => {
        assert(VpcEndpointId);
        assert(RouteTableId);
      }),
      () => ({ VpcEndpointId, AddRouteTableIds: [RouteTableId] }),
      ec2().modifyVpcEndpoint,
      () =>
        retryCall({
          name: `modifyVpcEndpoint ${name}`,
          fn: pipe([
            () => ({ RouteTableId, GatewayId: VpcEndpointId }),
            getById,
          ]),
          config: { retryCount: 12 * 5, retryDelay: 5e3 },
          isExpectedResult: not(isEmpty),
        }),
      tap((params) => {
        assert(true);
      }),
      () =>
        retryCall({
          name: `modifyVpcEndpoint ${name}`,
          fn: pipe([
            () => dependencies().routeTable.getLive({ lives }),
            tap((params) => {
              assert(true);
            }),
            findRoute({ RouteTableId, GatewayId: VpcEndpointId }),
          ]),
          config: { retryCount: 12 * 5, retryDelay: 5e3 },
          isExpectedResult: not(isEmpty),
        }),
      tap((params) => {
        assert(true);
      }),
    ])();

  const create = pipe([
    switchCase([
      get("payload.VpcEndpointId"),
      createRouteVpcEndpoint,
      client.create({
        method: "createRoute",
        getById,
        pickCreated:
          ({ payload }) =>
          () =>
            payload,
        postCreate: ({ dependencies, lives }) =>
          pipe([() => dependencies().routeTable.getLive({ lives })]),
      }),
    ]),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteRoute-property
  const destroy = switchCase([
    pipe([get("live.GatewayId", ""), callProp("startsWith", "vpce-")]),
    ({ live: { GatewayId, RouteTableId } }) =>
      pipe([
        tap(() => {
          assert(GatewayId);
          assert(RouteTableId);
        }),
        () => ({
          VpcEndpointId: GatewayId,
          RemoveRouteTableIds: [RouteTableId],
        }),
        ec2().modifyVpcEndpoint,
      ])(),
    client.destroy({
      pickId: pick([
        "DestinationCidrBlock",
        "RouteTableId",
        "DestinationIpv6CidrBlock",
        "DestinationPrefixListId",
      ]),
      method: "deleteRoute",
      //TODO
      //getById,
      ignoreErrorCodes,
      config,
    }),
  ]);

  const configDefault = ({
    name,
    namespace,
    properties = {},
    dependencies: { routeTable, natGateway, ig, vpcEndpoint },
  }) =>
    pipe([
      tap((params) => {
        assert(routeTable, "Route is missing the dependency 'routeTable'");
        assert(
          ig || natGateway || vpcEndpoint,
          "Route needs the dependency 'ig', or 'natGateway' or 'vpcEndpoint'"
        );
      }),
      () => properties,
      defaultsDeep({
        RouteTableId: getField(routeTable, "RouteTableId"),
      }),
      switchCase([
        () => vpcEndpoint,
        defaultsDeep({}),
        defaultsDeep({
          DestinationCidrBlock: "0.0.0.0/0",
        }),
      ]),
      when(
        () => natGateway,
        defaultsDeep({
          NatGatewayId: getField(natGateway, "NatGatewayId"),
        })
      ),
      when(
        () => ig,
        defaultsDeep({
          GatewayId: getField(ig, "InternetGatewayId"),
        })
      ),
      when(
        () => vpcEndpoint,
        defaultsDeep({
          VpcEndpointId: getField(vpcEndpoint, "VpcEndpointId"),
        })
      ),
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
