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
  fork,
  switchCase,
  all,
} = require("rubico");
const {
  isEmpty,
  find,
  first,
  forEach,
  defaultsDeep,
  pluck,
  includes,
} = require("rubico/x");

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
exports.AwsRouteTable = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = Ec2New(config);
  const findId = get("live.RouteTableId");
  const findName = findNameInTagsOrId({ findId });

  const isDefault = ({ live, lives }) =>
    pipe([
      () => live,
      get("Associations"),
      first,
      get("Main"),
      tap((result) => {
        logger.debug(`isDefault ${live.RouteTableId} : ${result}`);
      }),
    ])();

  const findDependencies = ({ live }) => [
    { type: "Vpc", ids: [live.VpcId] },
    {
      type: "Subnet",
      ids: pipe([
        () => live,
        get("Associations"),
        pluck("SubnetId"),
        filter(not(isEmpty)),
      ])(),
    },
  ];

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

  // const isUpById = isUpByIdCore({
  //   getById,
  // });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRouteTable-property
  const create = async ({
    payload,
    name,
    resolvedDependencies: { vpc, subnets },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create rt ${tos({ name })}`);
        assert(vpc, "RouteTable is missing the dependency 'vpc'");
        assert(
          Array.isArray(subnets),
          "RouteTable is missing the dependency 'subnets' array"
        );
        assert(
          all(get("live.SubnetId"))(subnets),
          "one of the subnet is not up"
        );
      }),
      () =>
        defaultsDeep({
          VpcId: vpc.live.VpcId,
        })(payload),
      (params) => ec2().createRouteTable(params),
      get("RouteTable.RouteTableId"),
      tap((RouteTableId) =>
        forEach(
          pipe([
            get("live.SubnetId"),
            tap((SubnetId) => {
              logger.info(
                `associateRouteTable ${tos({ name, SubnetId, SubnetId })}`
              );
              assert(SubnetId, "SubnetId");
            }),
            (SubnetId) =>
              ec2().associateRouteTable({
                RouteTableId,
                SubnetId,
              }),
          ])
        )(subnets)
      ),
      tap((RouteTableId) => {
        logger.info(`created rt ${JSON.stringify({ name, RouteTableId })}`);
      }),
      (RouteTableId) => ({ id: RouteTableId }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateRouteTable-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy route table ${tos({ name, id })}`);
      }),
      () => getById({ id }),
      tap.if(isEmpty, () => {
        throw Error(`Cannot get route tables: ${id}`);
      }),
      get("Associations"),
      filter(not(get("Main"))),
      map(async (association) => {
        logger.debug(`destroy disassociate ${tos({ association })}`);
        //TODO tryCatch
        await ec2().disassociateRouteTable({
          AssociationId: association.RouteTableAssociationId,
        });
      }),
      tap(() => {
        logger.debug(`deleting rt ${JSON.stringify({ RouteTableId: id })}`);
      }),
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

  const configDefault = async ({ name, namespace, properties }) =>
    defaultsDeep({
      TagSpecifications: [
        {
          ResourceType: "route-table",
          Tags: buildTags({ config, namespace, name }),
        },
      ],
    })(properties);

  const cannotBeDeleted = ({ live, name }) =>
    pipe([() => live, eq(get("RouteTableId"), name)])();

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
