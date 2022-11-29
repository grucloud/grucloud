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
  prepend,
  identity,
  when,
} = require("rubico/x");

const { retryCall } = require("@grucloud/core/Retry");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({ prefix: "AwsRoute" });

const { findNamespaceInTags } = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const { createEC2 } = require("./EC2Common");

const { appendCidrSuffix } = require("./EC2Common");

const ignoreErrorCodes = [
  "InvalidRouteTableID.NotFound",
  "InvalidRoute.NotFound",
  "InvalidVpcEndpointId.NotFound",
];

exports.EC2Route = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const findId =
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(live.RouteTableId);
        }),
        () => live,
        get("RouteTableId"),
        lives.getById({
          type: "RouteTable",
          group: "EC2",
          providerName: config.providerName,
        }),
        tap((routeTable) => {
          assert(routeTable, `no rtb ${live.RouteTableId}`);
        }),
        get("name", "no-route-table-id"),
        switchCase([
          () => live.CoreNetworkArn,
          append("::core-network"),
          // Nat Gateway
          () => live.NatGatewayId,
          append("::nat-gateway"),
          // Local route
          () => live.GatewayId === "local",
          append("::local"),
          // VpnGateway
          pipe([
            () => live,
            get("GatewayId", ""),
            callProp("startsWith", "vgw-"),
          ]),
          pipe([append("::vgw")]),
          // Internet Gateway
          pipe([
            () => live,
            get("GatewayId", ""),
            callProp("startsWith", "igw-"),
          ]),
          pipe([append("::igw")]),
          // Vpc Endpoint
          pipe([
            () => live,
            get("GatewayId", ""),
            callProp("startsWith", "vpce-"),
          ]),
          (rt) =>
            pipe([
              () => live,
              get("GatewayId"),
              lives.getById({
                type: "VpcEndpoint",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name", live.GatewayId),
              prepend(`${rt}::`),
            ])(),
          // Instance
          () => live.InstanceId,
          (rt) =>
            pipe([
              () => live,
              get("InstanceId"),
              lives.getById({
                type: "Instance",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name", live.InstanceId),
              prepend(`${rt}::`),
            ])(),
          // Vpc Peering Connection
          () => live.VpcPeeringConnectionId,
          pipe([append(`::pcx`)]),
          // Network Interface
          () => live.NetworkInterfaceId,
          pipe([append(`::eni`)]),
          // Transit Gateway
          () => live.TransitGatewayId,
          pipe([append(`::tgw`)]),
          // Egress Only Internet Gateway
          () => live.EgressOnlyInternetGatewayId,
          pipe([append(`::eogw`)]),
          // Other
          () => {
            assert(false, "invalid route target");
          },
        ]),
        switchCase([
          pipe([
            () => live,
            and([
              get("DestinationPrefixListId"),
              not(pipe([get("GatewayId", ""), callProp("startsWith", "vpce")])),
            ]),
          ]),
          (id) =>
            pipe([
              () => live,
              get("DestinationPrefixListId"),
              lives.getById({
                type: "ManagedPrefixList",
                group: "EC2",
                providerName: config.providerName,
              }),
              get("name"),
              tap((name) => {
                assert(name);
              }),
              prepend(`${id}::`),
            ])(),
          appendCidrSuffix(live),
        ]),
        tap((params) => {
          assert(true);
        }),
      ])();

  const findName = (params) => (live) => {
    const fns = [findId(params)];
    for (fn of fns) {
      const name = fn(live);
      if (!isEmpty(name)) {
        return name;
      }
    }
    assert(false, "should have a name");
  };

  const isDefault = () => pipe([eq(get("GatewayId"), "local")]);

  const findRoute = ({
    CoreNetworkArn,
    EgressOnlyInternetGatewayId,
    GatewayId,
    InstanceId,
    NatGatewayId,
    TransitGatewayId,
    VpcEndpointId,
    VpcPeeringConnectionId,
  }) =>
    pipe([
      tap((rt) => {
        assert(rt);
      }),
      get("Routes"),
      tap((Routes) => {
        assert(Routes);
        logger.debug(
          `findRoute #Routes ${size(
            Routes
          )}, GatewayId ${GatewayId}, NatGatewayId ${NatGatewayId}, TransitGatewayId ${TransitGatewayId}, VpcEndpointId: ${VpcEndpointId}, EgressOnlyInternetGatewayId: ${EgressOnlyInternetGatewayId}, InstanceId: ${InstanceId}, CoreNetworkArn: ${CoreNetworkArn}`
        );
        logger.debug(JSON.stringify(Routes));
      }),
      find(
        pipe([
          switchCase([
            () => CoreNetworkArn,
            eq(get("CoreNetworkArn"), CoreNetworkArn),
            () => GatewayId,
            eq(get("GatewayId"), GatewayId),
            () => NatGatewayId,
            eq(get("NatGatewayId"), NatGatewayId),
            () => TransitGatewayId,
            eq(get("TransitGatewayId"), TransitGatewayId),
            () => VpcEndpointId,
            eq(get("GatewayId"), VpcEndpointId),
            () => InstanceId,
            eq(get("InstanceId"), InstanceId),
            () => VpcPeeringConnectionId,
            eq(get("VpcPeeringConnectionId"), VpcPeeringConnectionId),
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
      ({ RouteTableId }) => ({
        RouteTableIds: [RouteTableId],
      }),
    ]),
    method: "describeRouteTables",
    getField: "RouteTables",
    decorate: ({ live }) => pipe([findRoute(live)]),
    ignoreErrorCodes,
  });

  const getListFromLive = ({ lives }) =>
    pipe([
      tap(() => {
        //logger.debug(`getListFromLive`);
      }),
      lives.getByType({
        type: "RouteTable",
        group: "EC2",
        providerName: config.providerName,
      }),
      flatMap((resource) =>
        pipe([
          tap(() => {
            //logger.debug(`getList resource ${resource.name}`);
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

  const getByName = pipe([getByNameCore({ getList, findName })]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRoute-property
  // Create vpc endpoint route with https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifyVpcEndpoint-property

  const createRouteVpcEndpoint = ({
    name,
    payload: { VpcEndpointId, RouteTableId },
    dependencies,
    resolvedDependencies,
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
            getById({}),
          ]),
          config: { retryCount: 12 * 5, retryDelay: 5e3 },
          isExpectedResult: not(isEmpty),
        }),
      () =>
        retryCall({
          name: `modifyVpcEndpoint routeTable ${name}`,
          fn: pipe([
            () => ({
              lives,
              resolvedDependencies,
            }),
            dependencies().routeTable.getLive,
            findRoute({ RouteTableId, GatewayId: VpcEndpointId }),
          ]),
          config: { retryCount: 12 * 5, retryDelay: 5e3 },
          isExpectedResult: not(isEmpty),
        }),
    ])();

  const create = pipe([
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
        shouldRetryOnExceptionCodes: [
          "InvalidTransitGatewayID.NotFound",
          "InvalidGatewayID.NotFound",
          "InvalidVpcEndpointId.NotFound",
        ],
        shouldRetryOnExceptionMessages: [
          "VPC Endpoints of this type cannot be used as route targets",
        ],
        getById,
        pickCreated:
          ({ payload }) =>
          () =>
            payload,
        postCreate: ({
          name,
          dependencies,
          lives,
          payload,
          resolvedDependencies,
        }) =>
          pipe([
            () =>
              retryCall({
                name: `create route ${name}, is up ? `,
                fn: pipe([
                  () =>
                    dependencies().routeTable.getLive({
                      lives,
                      resolvedDependencies,
                    }),
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
        and([
          pipe([
            () => live,
            get("GatewayId", ""),
            callProp("startsWith", "vpce"),
          ]),
          pipe([
            () => live,
            get("GatewayId"),
            lives.getById({
              type: "VpcEndpoint",
              group: "EC2",
              providerName: config.providerName,
            }),
            eq(get("live.VpcEndpointType"), "Gateway"),
          ]),
        ]),
      ])(),
    ({ live: { GatewayId, RouteTableId } }) =>
      pipe([
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
    dependencies: {
      coreNetwork,
      ec2Instance,
      ig,
      egressOnlyInternetGateway,
      natGateway,
      prefixList,
      routeTable,
      transitGateway,
      vpcEndpoint,
      vpcPeeringConnection,
      vpnGateway,
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
            egressOnlyInternetGateway ||
            ec2Instance ||
            vpcPeeringConnection ||
            vpnGateway,
          "Route needs the dependency 'ig', or 'natGateway' or 'vpcEndpoint', or 'transitGateway' or 'egressOnlyInternetGateway' or 'ec2Instance', or 'vpcPeeringConnection' or 'vpnGateway'"
        );
      }),
      () => properties,
      defaultsDeep({
        RouteTableId: getField(routeTable, "RouteTableId"),
      }),
      when(
        () => prefixList,
        defaultsDeep({
          DestinationPrefixListId: getField(prefixList, "PrefixListId"),
        })
      ),
      switchCase([
        () => coreNetwork,
        defaultsDeep({
          CoreNetworkArn: getField(coreNetwork, "CoreNetworkArn"),
        }),
        () => natGateway,
        defaultsDeep({
          NatGatewayId: getField(natGateway, "NatGatewayId"),
        }),
        () => ig,
        defaultsDeep({
          GatewayId: getField(ig, "InternetGatewayId"),
        }),
        () => ec2Instance,
        defaultsDeep({
          InstanceId: getField(ec2Instance, "InstanceId"),
        }),
        () => vpcEndpoint,
        defaultsDeep({
          VpcEndpointId: getField(vpcEndpoint, "VpcEndpointId"),
        }),
        () => vpcPeeringConnection,
        defaultsDeep({
          VpcPeeringConnectionId: getField(
            vpcPeeringConnection,
            "VpcPeeringConnectionId"
          ),
        }),
        () => transitGateway,
        defaultsDeep({
          TransitGatewayId: getField(transitGateway, "TransitGatewayId"),
        }),
        () => egressOnlyInternetGateway,
        defaultsDeep({
          EgressOnlyInternetGatewayId: getField(
            egressOnlyInternetGateway,
            "EgressOnlyInternetGatewayId"
          ),
        }),
        () => vpnGateway,
        defaultsDeep({
          GatewayId: getField(vpnGateway, "VpnGatewayId"),
        }),
        identity,
      ]),
    ])();

  return {
    spec,
    findId,
    findNamespace: findNamespaceInTags(config),
    getByName,
    getById,
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
