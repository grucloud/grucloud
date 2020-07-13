const AWS = require("aws-sdk");
const { defaultsDeep, isEmpty } = require("lodash/fp");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsRtb" });
const { tos } = require("../../tos");
const { retryExpectOk } = require("../Retry");
const { getByIdCore } = require("./AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../Common");
const { findNameInTags } = require("./AwsCommon");
const { tagResource } = require("./AwsTagResource");
const { pipe, filter, map } = require("rubico");

module.exports = AwsRouteTables = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { stage } = config;
  assert(stage);

  const ec2 = new AWS.EC2();

  const findName = findNameInTags;
  const findId = (item) => {
    assert(item);
    const id = item.RouteTableId;
    assert(id);
    return id;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeRouteTables-property
  const getList = async (params) => {
    logger.debug(`list ${tos(params)}`);
    const { RouteTables } = await ec2.describeRouteTables(params).promise();
    logger.info(`list ${tos(RouteTables)}`);

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
    } = await ec2.createRouteTable(paramCreate).promise();
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
    await ec2.associateRouteTable(paramsAttach).promise();

    logger.debug(`associated`);

    await retryExpectOk({
      name: `isUpById: ${name} id: ${RouteTableId}`,
      fn: () => isUpById({ id: RouteTableId }),
      config,
    });

    return { id: RouteTableId };
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateRouteTable-property
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ${tos({ name, id })}`);

    if (isEmpty(id)) {
      throw Error(`destroy invalid id`);
    }
    const rtLive = await getById({ id });
    await pipe([
      filter((association) => !association.Main),
      async (associations) =>
        await map(async (association) => {
          logger.debug(`destroy disassociate ${tos({ association })}`);
          await ec2
            .disassociateRouteTable({
              AssociationId: association.RouteTableAssociationId,
            })
            .promise();
        })(associations),
    ])(rtLive.Associations);

    logger.debug(`destroying ${tos({ RouteTableId: id })}`);
    await ec2.deleteRouteTable({ RouteTableId: id }).promise();
    logger.debug(`destroyed ${tos({ name, id })}`);
    return;
  };

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({}, properties);

  const cannotBeDeleted = ({ resource, name }) => {
    logger.debug(`cannotBeDeleted name: ${name} ${tos({ resource })}`);
    return !name;
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
  };
};
