const assert = require("assert");
const AWS = require("aws-sdk");
const { get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByIdCore } = require("../AwsCommon");
const { retryExpectOk } = require("../../Retry");
const { getField } = require("../../ProviderCommon");

const {
  getByNameCore,
  findField,
  isUpByIdCore,
  isDownByIdCore,
} = require("../../Common");
const logger = require("../../../logger")({ prefix: "AwsSg" });
const { tagResource } = require("../AwsTagResource");
const { CheckAwsTags } = require("../AwsTagCheck");
const { tos } = require("../../../tos");

module.exports = AwsSecurityGroup = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { managedByDescription } = config;
  const ec2 = new AWS.EC2();

  const findName = (item) => findField({ item, field: "GroupName" });
  const findId = get("GroupId");

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSecurityGroups-property
  const getList = async ({ params } = {}) => {
    logger.debug(`list`);
    const securityGroups = await new Promise((resolve, reject) => {
      ec2.describeSecurityGroups(params, (error, response) => {
        if (error) {
          return reject(error.message);
        } else {
          logger.debug(`list ${tos(response)}`);
          resolve(response.SecurityGroups);
        }
      });
    });
    logger.debug(`list ${tos(securityGroups)}`);

    return {
      total: securityGroups.length,
      items: securityGroups,
    };
  };

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = getByIdCore({ fieldIds: "GroupIds", getList });

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  const cannotBeDeleted = ({ resource }) => {
    assert(resource.GroupName);
    return resource.GroupName === "default";
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);

    const createParams = {
      Description: managedByDescription,
      GroupName: name,
      ...payload.create,
    };

    logger.debug(`create ${tos({ name, createParams, payload })}`);
    const { GroupId } = await ec2.createSecurityGroup(createParams).promise();
    logger.debug(`create GroupId ${tos(GroupId)}`);

    await retryExpectOk({
      name: `isUpById: ${name} id: ${GroupId}`,
      fn: () => isUpById({ id: GroupId }),
      config,
    });

    await tagResource({
      config,
      name,
      resourceType: "security-group",
      resourceId: GroupId,
    });

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
    const ingressParam = {
      GroupId,
      ...payload.ingress,
    };
    logger.debug(`create ingressParam ${tos({ ingressParam })}`);

    await ec2.authorizeSecurityGroupIngress(ingressParam).promise();

    logger.debug(`create DONE`);

    const sg = await getById({ id: GroupId });

    assert(
      CheckAwsTags({
        config,
        tags: sg.Tags,
        name: name,
      }),
      `missing tag for ${name}`
    );

    return { GroupId };
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ${tos({ name, id })}`);
    assert(id);
    const result = await ec2.deleteSecurityGroup({ GroupId: id }).promise();
    return result;
  };

  const configDefault = async ({ name, properties, dependencies }) => {
    logger.debug(
      `configDefault ${tos({
        name,
        properties,
        dependencies,
      })}`
    );
    const { vpc } = dependencies;
    assert(vpc, "missing vpc dependency");

    const config = defaultsDeep(properties)({
      create: {
        ...(vpc && { VpcId: getField(vpc, "VpcId") }),
      },
    });
    logger.debug(`configDefault ${name} result: ${tos(config)}`);
    return config;
  };

  return {
    type: "SecurityGroup",
    spec,
    findId,
    getByName,
    getById,
    findName,
    cannotBeDeleted,
    isUpById,
    isDownById,
    getList,
    create,
    destroy,
    configDefault,
  };
};
