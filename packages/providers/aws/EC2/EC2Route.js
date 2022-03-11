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
      type: "ManagedPrefixList",
      group: "EC2",
      ids: [
        pipe([
          () =>
            lives.getById({
              id: live.DestinationPrefixListId,
              type: "ManagedPrefixList",
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

  const getById = client.getById({
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      tap(({ RouteTableId }) => {
        assert(RouteTableId);
      }),
      ({ RouteTableId }) => ({
        RouteTableIds: [RouteTableId],
      }),
    ]),
    method: "describeRouteTables",
    getField: "RouteTables",
    decorate: ({ GatewayId, NatGatewayId, VpcEndpointId }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        get("Routes"),
        find(
          pipe([
            tap((params) => {
              assert(true);
            }),
            switchCase([
              () => GatewayId,
              eq(get("GatewayId"), GatewayId),
              () => NatGatewayId,
              eq(get("NatGatewayId"), NatGatewayId),
              () => VpcEndpointId,
              eq(get("VpcEndpointId"), VpcEndpointId),
              () => {
                assert(false, "missing route destination");
              },
            ]),
          ])
        ),
      ]),
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

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRoute-property
  //TODO create vpv endpoint route with https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#modifyVpcEndpoint-property
  const create = client.create({
    method: "createRoute",
    getById,
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    postCreate: ({ dependencies, lives }) =>
      pipe([
        tap((params) => {
          assert(dependencies);
          assert(lives);
        }),
        () => dependencies().routeTable.getLive({ lives }),
      ]),
  });

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
    ignoreErrorCodes,
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties = {},
    dependencies: {
      routeTable,
      managedPrefixList,
      natGateway,
      ig,
      vpcEndpoint,
    },
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
        () => managedPrefixList,
        defaultsDeep({
          DestinationPrefixListId: getField(managedPrefixList, "PrefixListId"),
        }),
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
