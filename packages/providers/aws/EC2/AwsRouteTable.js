const assert = require("assert");
const {
  tap,
  get,
  pipe,
  filter,
  map,
  not,
  eq,
  or,
  any,
  all,
  tryCatch,
  switchCase,
} = require("rubico");
const { isEmpty, first, defaultsDeep, pluck, find } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AwsRouteTable" });
const { tos } = require("@grucloud/core/tos");
const { retryCall } = require("@grucloud/core/Retry");
const { getByIdCore, buildTags } = require("../AwsCommon");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const {
  Ec2New,
  findNameInTagsOrId,
  shouldRetryOnException,
  findNamespaceInTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

exports.AwsRouteTable = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { providerName } = config;
  const ec2 = Ec2New(config);
  const findId = get("live.RouteTableId");

  const isDefault = ({ live, lives }) =>
    pipe([
      () => live,
      get("Associations"),
      first,
      get("Main"),
      tap((result) => {
        assert(true);
      }),
    ])();

  const findDefaultName = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(live.VpcId);
      }),
      () =>
        lives.getById({
          type: "Vpc",
          group: "ec2",
          providerName,
          id: live.VpcId,
        }),
      tap((params) => {
        assert(true);
      }),
      get("name"),
      tap((name) => {
        //TODO
        //assert(name);
      }),
      (name) => `rt-default-${name}`,
    ])();

  const findName = switchCase([
    isDefault,
    findDefaultName,
    findNameInTagsOrId({ findId }),
  ]);

  const findDependencies = ({ live }) => [
    { type: "Vpc", group: "ec2", ids: [live.VpcId] },
    {
      type: "Subnet",
      group: "ec2",
      ids: pipe([
        () => live,
        get("Associations"),
        pluck("SubnetId"),
        filter(not(isEmpty)),
      ])(),
    },
  ];

  const routeTableAssociate = ({ RouteTableId, subnets }) =>
    pipe([
      tap(() => {
        assert(RouteTableId);
        assert(subnets);
      }),
      () => subnets,
      pluck("live.SubnetId"),
      map(
        tryCatch(
          pipe([
            tap((SubnetId) => {
              logger.info(
                `associateRouteTable ${JSON.stringify({
                  RouteTableId,
                  SubnetId,
                })}`
              );
              assert(SubnetId, "SubnetId");
            }),
            (SubnetId) =>
              ec2().associateRouteTable({
                RouteTableId,
                SubnetId,
              }),
          ]),
          (error, SubnetId) =>
            pipe([
              tap(() => {
                logger.error(
                  `error associateRouteTable ${tos({
                    RouteTableId,
                    SubnetId,
                    error,
                  })}`
                );
              }),
              () => ({ error, RouteTableId, SubnetId }),
            ])()
        )
      ),
      tap.if(any(get("error")), (results) => {
        throw results;
      }),
    ])();

  const routeTableDisassociate = ({ live }) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => live,
      get("Associations"),
      filter(not(get("Main"))),
      map(
        tryCatch(
          pipe([
            tap(({ RouteTableAssociationId }) => {
              assert(RouteTableAssociationId);
            }),
            ({ RouteTableAssociationId }) =>
              ec2().disassociateRouteTable({
                AssociationId: RouteTableAssociationId,
              }),
          ]),
          (error, association) =>
            pipe([
              tap(() => {
                logger.error(
                  `error disassociateRouteTable ${tos({ association, error })}`
                );
              }),
              () => ({ error, association }),
            ])()
        )
      ),
      tap.if(any(get("error")), (result) => {
        throw result;
      }),
    ])();

  const routesDelete = ({ live }) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => live,
      get("Routes"),
      filter(eq(get("State"), "blackhole")),
      tap((Routes) => {
        assert(true);
      }),
      map(
        tryCatch(
          pipe([
            tap((Route) => {
              assert(Route);
            }),
            (Route) =>
              ec2().deleteRoute({
                RouteTableId: live.RouteTableId,
                DestinationCidrBlock: Route.DestinationCidrBlock,
              }),
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
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeRouteTables-property
  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList rt ${JSON.stringify(params)}`);
      }),
      () => ec2().describeRouteTables(params),
      get("RouteTables"),
      tap((items) => {
        logger.debug(`getList rt result: ${tos(items)}`);
      }),
      (items) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList #rt ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });
  const getById = getByIdCore({ fieldIds: "RouteTableIds", getList });
  const isUpById = isUpByIdCore({ getById });

  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRouteTable-property
  const create = async ({
    payload,
    name,
    dependencies,
    resolvedDependencies: { subnets },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create rt ${tos({ name })}`);
        assert(
          all(get("live.SubnetId"))(subnets),
          "one of the subnet is not up"
        );
      }),
      () => ec2().createRouteTable(payload),
      get("RouteTable"),
      tap(({ RouteTableId }) =>
        retryCall({
          name: `create rt isUpById: ${name} id: ${RouteTableId}`,
          fn: () => isUpById({ id: RouteTableId, name }),
          config,
        })
      ),
      ({ RouteTableId }) => routeTableAssociate({ RouteTableId, subnets }),
      tap(({ RouteTableId }) => {
        logger.info(`created rt ${JSON.stringify({ name, RouteTableId })}`);
      }),
      ({ RouteTableId }) => ({ id: RouteTableId }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateRouteTable-property
  const destroy = async ({ id, name, live }) =>
    pipe([
      tap(() => {
        logger.info(`destroy route table ${JSON.stringify({ name, id })}`);
        assert(live);
        assert(id);
      }),
      () => routeTableDisassociate({ live }),
      () => routesDelete({ live }),
      () => ec2().deleteRouteTable({ RouteTableId: id }),
      tap(() =>
        retryCall({
          name: `destroy rt isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id, name }),
          config,
        })
      ),
      tap(() => {
        logger.info(`rt destroyed ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { vpc, subnets },
  }) =>
    pipe([
      tap(() => {
        assert(vpc, "RouteTable is missing the dependency 'vpc'");
        assert(
          Array.isArray(subnets),
          "RouteTable is missing the dependency 'subnets' array"
        );
      }),
      () => properties,
      defaultsDeep({
        VpcId: getField(vpc, "VpcId"),
        TagSpecifications: [
          {
            ResourceType: "route-table",
            Tags: buildTags({ config, namespace, name }),
          },
        ],
      }),
    ])();

  const cannotBeDeleted = isDefault;

  return {
    spec,
    isDefault,
    findId,
    findName,
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    getByName,
    getById,
    cannotBeDeleted,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
