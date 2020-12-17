const assert = require("assert");
const AWS = require("aws-sdk");
const { tap, get, pipe, filter, map, not, eq } = require("rubico");
const { isEmpty, defaultsDeep } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "AwsRtb" });
const { tos } = require("../../../tos");
const { retryCall } = require("../../Retry");
const { getByIdCore } = require("../AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const {
  Ec2New,
  findNameInTags,
  shouldRetryOnException,
} = require("../AwsCommon");
const { tagResource } = require("../AwsTagResource");
const { CheckAwsTags } = require("../AwsTagCheck");

module.exports = AwsRouteTables = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { stage } = config;
  assert(stage);

  const ec2 = Ec2New(config);

  const findName = (item) => {
    const name = findNameInTags(item);
    if (name) {
      return name;
    }
    return findId(item);
  };

  const findId = get("RouteTableId");

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeRouteTables-property
  const getList = async ({ params } = {}) => {
    logger.debug(`list ${tos(params)}`);
    const { RouteTables } = await ec2().describeRouteTables(params).promise();
    logger.debug(`list ${tos(RouteTables)}`);

    return {
      total: RouteTables.length,
      items: RouteTables,
    };
  };

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = getByIdCore({ fieldIds: "RouteTableIds", getList });

  const isUpById = isUpByIdCore({
    getById,
  });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createRouteTable-property
  const create = async ({ name, payload, dependencies }) => {
    assert(name);
    const { vpc } = dependencies;

    assert(vpc, "RouteTables is missing the dependency 'vpc'");
    const vpcLive = await vpc.getLive();
    assert(vpcLive.VpcId);

    const paramCreate = {
      VpcId: vpcLive.VpcId,
    };
    logger.debug(`create ${tos({ name, paramCreate })}`);
    const {
      RouteTable: { RouteTableId },
    } = await ec2().createRouteTable(paramCreate).promise();
    assert(RouteTableId);
    logger.info(`created ${RouteTableId}`);

    await tagResource({
      config,
      name,
      resourceType: "RouteTables",
      resourceId: RouteTableId,
    });

    const { subnet } = dependencies;
    assert(subnet, "RouteTables is missing the dependency 'subnet'");
    const subnetLive = await subnet.getLive();
    assert(subnetLive, "subnetLive");

    assert(subnetLive.SubnetId, "SubnetId");
    const paramsAttach = {
      RouteTableId,
      SubnetId: subnetLive.SubnetId,
    };
    logger.debug(`create, associating with subnet ${tos({ subnetLive })}`);
    //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateRouteTable-property
    await ec2().associateRouteTable(paramsAttach).promise();

    logger.debug(`associated`);

    const rt = await retryCall({
      name: `rt isUpById: ${name} id: ${RouteTableId}`,
      fn: () => isUpById({ id: RouteTableId }),
      config,
    });

    assert(
      CheckAwsTags({
        config,
        tags: rt.Tags,
        name: name,
      }),
      `missing tag for ${name}`
    );
    return { id: RouteTableId };
  };

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
        await ec2()
          .disassociateRouteTable({
            AssociationId: association.RouteTableAssociationId,
          })
          .promise();
      }),
      tap(() => {
        logger.debug(`destroying ${tos({ RouteTableId: id })}`);
      }),
      () => ec2().deleteRouteTable({ RouteTableId: id }).promise(),
      tap(() => {
        logger.debug(`destroyed ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({})(properties);

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
