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
  and,
} = require("rubico");
const {
  isEmpty,
  defaultsDeep,
  find,
  size,
  append,
  callProp,
  when,
  prepend,
} = require("rubico/x");

const { retryCall } = require("@grucloud/core/Retry");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({ prefix: "AwsRoute" });

const { findNamespaceInTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const { createEC2 } = require("./EC2Common");

const { appendCidrSuffix } = require("./EC2Common");

const ignoreErrorCodes = ["InvalidRoute.NotFound"];

exports.EC2Route = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const findId = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(live.RouteTableId);
        assert(lives);
        logger.debug(`route findId ${JSON.stringify(live)}`);
      }),
      () =>
        lives.getById({
          type: "RouteTable",
          group: "EC2",
          providerName: config.providerName,
          id: live.RouteTableId,
        }),
      tap((routeTable) => {
        assert(routeTable, `no rtb ${live.RouteTableId}`);
      }),
      get("name", "no-route-table-id"),
      switchCase([
        // Nat Gateway
        () => live.NatGatewayId,
        append("-nat-gateway"),
        // Local route
        () => live.GatewayId === "local",
        append("-local"),
        // Internet Gateway
        pipe([
          () => live,
          get("GatewayId", ""),
          callProp("startsWith", "igw-"),
        ]),
        pipe([append("-igw")]),
        // Vpc Endpoint
        pipe([
          () => live,
          get("GatewayId", ""),
          callProp("startsWith", "vpce-"),
        ]),
        (rt) =>
          pipe([
            () =>
              lives.getById({
                type: "VpcEndpoint",
                group: "EC2",
                providerName: config.providerName,
                id: live.GatewayId,
              }),
            get("name"),
            tap((name) => {
              assert(
                name,
                `no id for VpcEndpoint: ${live.GatewayId}, provider: ${config.providerName}`
              );
            }),
            prepend(`${rt}-`),
          ])(),
        // Transit Gateway
        () => live.TransitGatewayId,
        pipe([append(`-tgw`)]),
        // Egress Only Internet Gateway
        () => live.EgressOnlyInternetGatewayId,
        pipe([append(`-eogw`)]),
        // Other
        () => {
          assert(false, "invalid route target");
        },
      ]),
      appendCidrSuffix(live),
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
    {
      type: "TransitGateway",
      group: "EC2",
      ids: [live.TransitGatewayId],
    },
    {
      type: "EgressOnlyInternetGateway",
      group: "EC2",
      ids: [live.EgressOnlyInternetGatewayId],
    },
  ];

  const findRoute = ({
    GatewayId,
    NatGatewayId,
    TransitGatewayId,
    VpcEndpointId,
    EgressOnlyInternetGatewayId,
  }) =>
    pipe([
      get("Routes"),
      tap((Routes) => {
        assert(Routes);
        logger.debug(
          `findRoute #Routes ${size(
            Routes
          )}, GatewayId ${GatewayId}, NatGatewayId ${NatGatewayId}, TransitGatewayId ${TransitGatewayId}, VpcEndpointId: ${VpcEndpointId}, EgressOnlyInternetGatewayId: ${EgressOnlyInternetGatewayId}`
        );
        logger.debug(JSON.stringify(Routes));
      }),
      find(
        pipe([
          switchCase([
            () => GatewayId,
            eq(get("GatewayId"), GatewayId),
            () => NatGatewayId,
            eq(get("NatGatewayId"), NatGatewayId),
            () => TransitGatewayId,
            eq(get("NatGatewayId"), NatGatewayId),
            () => VpcEndpointId,
            eq(get("GatewayId"), VpcEndpointId),
            () => EgressOnlyInternetGatewayId,
            eq(get("EgressOnlyInternetGatewayId"), EgressOnlyInternetGatewayId),
            //
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
    decorate: pipe([get("live"), findRoute]),
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
      () =>
        retryCall({
          name: `modifyVpcEndpoint routeTable ${name}`,
          fn: pipe([
            () => dependencies().routeTable.getLive({ lives }),
            findRoute({ RouteTableId, GatewayId: VpcEndpointId }),
          ]),
          config: { retryCount: 12 * 5, retryDelay: 5e3 },
          isExpectedResult: not(isEmpty),
        }),
    ])();

  const create = pipe([
    tap((params) => {
      assert(true);
    }),
    switchCase([
      and([
        get("payload.VpcEndpointId"),
        eq(
          get("resolvedDependencies.vpcEndpoint.live.VpcEndpointType"),
          "Gateway"
        ),
      ]),
      createRouteVpcEndpoint,
      client.create({
        method: "createRoute",
        shouldRetryOnExceptionCodes: ["InvalidTransitGatewayID.NotFound"],
        shouldRetryOnExceptionMessages: [
          "VPC Endpoints of this type cannot be used as route targets",
        ],
        getById,
        pickCreated:
          ({ payload }) =>
          () =>
            payload,
        postCreate: ({ name, dependencies, lives, payload }) =>
          pipe([
            () => dependencies().routeTable.getLive({ lives }),
            () =>
              retryCall({
                name: `create route ${name}, is up ? `,
                fn: pipe([
                  () => dependencies().routeTable.getLive({ lives }),
                  findRoute(payload),
                ]),
                config: { retryCount: 12 * 5, retryDelay: 5e3 },
                isExpectedResult: not(isEmpty),
              }),
          ]),
      }),
    ]),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteRoute-property
  const destroy = switchCase([
    ({ live, lives }) =>
      pipe([
        tap((params) => {
          assert(lives);
        }),
        and([
          pipe([
            () => live,
            get("GatewayId", ""),
            callProp("startsWith", "vpce"),
          ]),
          pipe([
            () =>
              lives.getById({
                id: live.GatewayId,
                type: "VpcEndpoint",
                group: "EC2",
                providerName: config.providerName,
              }),
            tap((params) => {
              assert(true);
            }),
            eq(get("live.VpcEndpointType"), "Gateway"),
            tap((params) => {
              assert(true);
            }),
          ]),
        ]),
      ])(),
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
        tap(({ VpcEndpointId }) => {
          assert(VpcEndpointId);
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
    dependencies: {
      routeTable,
      natGateway,
      ig,
      vpcEndpoint,
      transitGateway,
      egressOnlyInternetGateway,
    },
  }) =>
    pipe([
      tap((params) => {
        assert(routeTable, "Route is missing the dependency 'routeTable'");
        assert(
          ig ||
            natGateway ||
            vpcEndpoint ||
            transitGateway ||
            egressOnlyInternetGateway,
          "Route needs the dependency 'ig', or 'natGateway' or 'vpcEndpoint', or 'transitGateway' or 'egressOnlyInternetGateway'"
        );
      }),
      () => properties,
      defaultsDeep({
        RouteTableId: getField(routeTable, "RouteTableId"),
      }),
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
      when(
        () => transitGateway,
        defaultsDeep({
          TransitGatewayId: getField(transitGateway, "TransitGatewayId"),
        })
      ),
      when(
        () => egressOnlyInternetGateway,
        defaultsDeep({
          EgressOnlyInternetGatewayId: getField(
            egressOnlyInternetGateway,
            "EgressOnlyInternetGatewayId"
          ),
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
