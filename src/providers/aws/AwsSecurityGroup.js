var AWS = require("aws-sdk");
const _ = require("lodash");
const assert = require("assert");
const { retryExpectOk } = require("../Retry");
const { NotAvailable } = require("../ProviderCommon");

const {
  getByNameCore,
  getByIdCore,
  findField,
  isUpCore,
  isDownCore,
} = require("../Common");
const logger = require("../../logger")({ prefix: "AwsSecurityGroup" });
const { tagResource } = require("./AwsTagResource");

const toString = (x) => JSON.stringify(x, null, 4);

module.exports = AwsSecurityGroup = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { managedByDescription } = config;
  const ec2 = new AWS.EC2();

  const findName = (item) => findField({ item, field: "GroupName" });
  const findId = (item) => {
    assert(item);
    const id = item.GroupId;
    assert(id);
    return id;
  };

  const getByName = ({ name }) => getByNameCore({ name, list, findName });
  const getById = ({ id }) => getByIdCore({ id, list, findId });

  const isUp = ({ name }) => isUpCore({ name, getByName });
  const isDown = ({ id, name }) => isDownCore({ id, name, getById });

  const cannotBeDeleted = (item) => {
    assert(item.GroupName);
    return item.GroupName === "default";
  };

  const list = async () => {
    logger.debug(`list`);
    const ec2params = {};
    const securityGroups = await new Promise((resolve, reject) => {
      ec2.describeSecurityGroups(ec2params, (error, response) => {
        if (error) {
          return reject(error.message);
        } else {
          logger.debug(`list ${toString(response)}`);
          resolve(response.SecurityGroups);
        }
      });
    });
    logger.debug(`list ${toString(securityGroups)}`);

    return {
      data: {
        total: securityGroups.length,
        items: securityGroups,
      },
    };
  };

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);

    const createParams = {
      Description: managedByDescription,
      GroupName: name,
      ...payload.create,
    };

    logger.debug(`create sg ${toString({ name, createParams, payload })}`);
    const { GroupId } = await ec2.createSecurityGroup(createParams).promise();
    logger.debug(`create GroupId ${toString(GroupId)}`);

    await tagResource({
      config,
      name,
      resourceType: "security-group",
      resourceId: GroupId,
    });

    //TODO empty ingress ?
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
    const ingressParam = {
      GroupId,
      ...payload.ingress,
    };
    logger.debug(`create ingressParam ${toString({ ingressParam })}`);

    await ec2.authorizeSecurityGroupIngress(ingressParam).promise();

    logger.debug(`create sg DONE`);

    return { GroupId };
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy sg ${toString({ name, id })}`);

    if (_.isEmpty(id)) {
      throw Error(`destroy sg invalid id`);
    }

    await ec2.deleteSecurityGroup({ GroupId: id }).promise();
  };
  const configDefault = async ({ name, properties, dependenciesLive }) => {
    logger.debug(
      `configDefault sg ${toString({ name, properties, dependenciesLive })}`
    );
    // TODO Need vpc name here in parameter
    const { vpc } = dependenciesLive;
    const config = _.defaultsDeep(
      {
        create: { ...(vpc && { VpcId: _.get(vpc, "VpcId", NotAvailable) }) },
      },
      properties
    );
    logger.debug(`configDefault sg ${name} result: ${toString(config)}`);
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
    isUp,
    isDown,
    list,
    create,
    destroy,
    configDefault,
  };
};
