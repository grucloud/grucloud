const AWS = require("aws-sdk");
const { defaultsDeep, isEmpty } = require("lodash/fp");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsRouteTables" });
const { tos } = require("../../tos");
const { retryExpectOk } = require("../Retry");
const { getByIdCore } = require("./AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../Common");
const { findNameInTags } = require("./AwsCommon");
const { tagResource } = require("./AwsTagResource");

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
    logger.debug(`list rt ${tos(params)}`);
    const { RouteTables } = await ec2.describeRouteTables(params).promise();
    logger.info(`list rt ${tos(RouteTables)}`);

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
    logger.debug(`create rt  ${tos({ name, paramCreate })}`);
    const {
      RouteTable: { RouteTableId },
    } = await ec2.createRouteTable(paramCreate).promise();
    assert(RouteTableId);
    logger.info(`created rt ${RouteTableId}`);

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
    logger.debug(`create ig, ig attaching subnet ${tos({ subnetLive })}`);
    //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#associateRouteTable-property
    await ec2.associateRouteTable(paramsAttach).promise();

    logger.debug(`create ig, vpc attached`);

    await retryExpectOk({
      name: `isUpById: ${name} id: ${RouteTableId}`,
      fn: () => isUpById({ id: RouteTableId }),
      config,
    });

    return { id: RouteTableId };
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#disassociateRouteTable-property
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy rt ${tos({ name, id })}`);

    if (isEmpty(id)) {
      throw Error(`destroy rt invalid id`);
    }

    const rtLive = await getById({ id });

    const RouteTableAssociationId =
      rtLive.Associations[0]?.RouteTableAssociationId;

    if (RouteTableAssociationId) {
      logger.debug(
        `destroy rt disassociate ${tos({ RouteTableAssociationId })}`
      );
      assert(RouteTableAssociationId);

      await ec2
        .disassociateRouteTable({
          AssociationId: RouteTableAssociationId,
        })
        .promise();
    }
    logger.debug(`destroy rt delete ${tos({ RouteTableId: id })}`);
    await ec2.deleteRouteTable({ RouteTableId: id }).promise();
    logger.debug(`destroy rt IN PROGRESS, ${tos({ name, id })}`);
    return;
  };

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({}, properties);

  return {
    type: "RouteTables",
    spec,
    findId,
    isUpById,
    isDownById,
    getByName,
    getById,
    findName,
    cannotBeDeleted: () => false,
    getList,
    create,
    destroy,
    configDefault,
  };
};
