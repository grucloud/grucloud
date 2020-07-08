const AWS = require("aws-sdk");
const { isEmpty } = require("lodash/fp");
const assert = require("assert");
const { map } = require("rubico");
const logger = require("../../logger")({ prefix: "AwsVpc" });
const { tos } = require("../../tos");
const { retryExpectOk } = require("../Retry");
const { getByIdCore } = require("./AwsCommon");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../Common");
const { findNameInTags } = require("./AwsCommon");
const { tagResource } = require("./AwsTagResource");

module.exports = AwsVpc = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = new AWS.EC2();

  const findName = findNameInTags;
  const findId = (item) => {
    assert(item);
    const id = item.VpcId;
    assert(id);
    return id;
  };

  const list = async (params = {}) => {
    logger.debug(`list vpc ${tos(params)}`);
    const { Vpcs } = await ec2.describeVpcs(params).promise();
    logger.info(`list ${tos(Vpcs)}`);

    return {
      total: Vpcs.length,
      items: Vpcs,
    };
  };

  const getByName = ({ name }) => getByNameCore({ name, list, findName });

  const getById = getByIdCore({ fieldIds: "VpcIds", list });

  const getStateName = (instance) => instance.State;

  const isUpById = isUpByIdCore({
    states: ["available"],
    getStateName,
    getById,
  });
  const isDownById = isDownByIdCore({ getById });

  const cannotBeDeleted = (item) => {
    assert(item.hasOwnProperty("IsDefault"));
    return item.IsDefault;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createVpc-property
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);
    logger.debug(`create vpc ${tos({ name, payload })}`);
    const {
      Vpc: { VpcId },
    } = await ec2.createVpc(payload).promise();
    logger.info(`create vpc ${VpcId}`);

    await retryExpectOk({
      name: `isUpById: ${name} id: ${VpcId}`,
      fn: () => isUpById({ id: VpcId }),
      isOk: (result) => result,
    });

    await tagResource({
      config,
      name,
      resourceType: "vpc",
      resourceId: VpcId,
    });

    return { VpcId };
  };
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy vpc ${tos({ name, id })}`);

    if (isEmpty(id)) {
      throw Error(`destroy vpc invalid id`);
    }

    //Remove SecurityGroup
    const { SecurityGroups } = await ec2
      .describeSecurityGroups({
        Filters: [
          {
            Name: "vpc-id",
            Values: [id],
          },
        ],
      })
      .promise();

    /*
    TODO  only for non default
    await map(async (securityGroup) => {
      logger.debug(`destroy vpc , deleting sg ${tos({ securityGroup })}`);
      await ec2
        .deleteSecurityGroup({ GroupId: securityGroup.GroupId })
        .promise();
    })(SecurityGroups);
*/
    //Remove Routing Tables
    const { RouteTables } = await ec2
      .describeRouteTables({
        Filters: [
          {
            Name: "vpc-id",
            Values: [id],
          },
        ],
      })
      .promise();

    await map(async (routeTable) => {
      await map(async (association) => {
        if (!association.Main) {
          logger.debug(
            `destroy vpc , disassociateRouteTable ${tos({ association })}`
          );
          await ec2
            .disassociateRouteTable({
              AssociationId: association.RouteTableAssociationId,
            })
            .promise();

          await ec2
            .deleteRouteTable({ RouteTableId: association.RouteTableId })
            .promise();
        }
      })(routeTable.Associations);
      logger.debug(`destroy vpc , deleting rt ${tos({ routeTable })}`);
    })(RouteTables);

    const result = await ec2.deleteVpc({ VpcId: id }).promise();
    logger.debug(`destroy vpc IN PROGRESS, ${tos({ name, id, result })}`);
    return result;
  };

  const configDefault = async ({ properties }) => properties;

  return {
    type: "Vpc",
    spec,
    findId,
    isUpById,
    isDownById,
    getByName,
    getById,
    findName,
    cannotBeDeleted,
    list,
    create,
    destroy,
    configDefault,
  };
};
