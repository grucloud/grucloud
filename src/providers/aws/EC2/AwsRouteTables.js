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
} = require("rubico");
const { isEmpty, defaultsDeep } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "AwsRouteTable" });
const { tos } = require("../../../tos");
const { retryCall } = require("../../Retry");
const { getByIdCore, buildTags } = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const {
  Ec2New,
  findNameInTagsOrId,
  shouldRetryOnException,
} = require("../AwsCommon");

exports.AwsRouteTables = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = Ec2New(config);

  const findId = get("RouteTableId");
  const findName = (item) => findNameInTagsOrId({ item, findId });

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

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = getByIdCore({ fieldIds: "RouteTableIds", getList });

  const isUpById = isUpByIdCore({
    getById,
  });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRouteTable-property
  const create = async ({
    payload,
    name,
    resolvedDependencies: { vpc, subnet },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create rt ${tos({ name })}`);
        assert(vpc, "RouteTables is missing the dependency 'vpc'");
        assert(subnet, "RouteTables is missing the dependency 'subnet'");
        assert(subnet.live.SubnetId, "subnet.live.SubnetId");
      }),
      () =>
        defaultsDeep({
          VpcId: vpc.live.VpcId,
        })(payload),
      (params) => ec2().createRouteTable(params),
      get("RouteTable.RouteTableId"),
      (RouteTableId) =>
        ec2().associateRouteTable({
          RouteTableId,
          SubnetId: subnet.live.SubnetId,
        }),
      tap((RouteTableId) => {
        logger.info(`created rt ${JSON.stringify({ name, RouteTableId })}`);
      }),
      (RouteTableId) => ({ id: RouteTableId }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateRouteTable-property
  const destroy = ({ id, name }) =>
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
      tap(() => {
        logger.info(`rt destroyed ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({
      TagSpecifications: [
        {
          ResourceType: "route-table",
          Tags: buildTags({ config, name }),
        },
      ],
    })(properties);

  const cannotBeDeleted = ({ resource, name }) => {
    logger.debug(`cannotBeDeleted name: ${name} ${tos({ resource })}`);
    return resource.RouteTableId === name;
  };

  return {
    type: "RouteTables",
    spec,
    findId,
    isUpById,
    isDownById,
    getByName,
    getById,
    findName,
    cannotBeDeleted,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
