const assert = require("assert");
const AWS = require("aws-sdk");
const { defaultsDeep } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "AwsKp" });
const { tos } = require("../../../tos");
const { getByNameCore, findField } = require("../../Common");

module.exports = AwsClientKeyPair = ({ spec, config }) => {
  assert(spec);
  assert(config);
  logger.info(`${tos(config)}`);

  const ec2 = new AWS.EC2();

  const findName = (item) => findField({ item, field: "KeyName" });
  const findId = (item) => findField({ item, field: "KeyPairId" });

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = ({ id }) => getByIdCore({ id, getList, findId });

  // TODO params in ec2.describeKeyPairs
  const getList = async ({ params } = {}) => {
    logger.debug(`list keypair `);
    const { KeyPairs } = await ec2.describeKeyPairs().promise();
    logger.debug(`list keypair: ${tos(KeyPairs)}`);

    return {
      total: KeyPairs.length,
      items: KeyPairs,
    };
  };

  const validate = async ({ name }) => {
    logger.debug(`validate ${name}`);
    const { KeyPairs } = await ec2.describeKeyPairs().promise();
    const names = KeyPairs.map((kp) => kp.KeyName);
    if (!names.includes(name)) {
      throw {
        code: 400,
        message: `The KeyPair '${name}' is not registered on AWS. ${
          names.length === 0
            ? "No key pairs exists"
            : `Available key pairs: ${names.join(",")}`
        }.\nVisit https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html to create a new key pair`,
      };
    }
  };

  const configDefault = async ({ properties }) => defaultsDeep({})(properties);

  return {
    type: "KeyPair",
    spec,
    findName,
    configDefault,
    findId,
    getByName,
    getById,
    getList,
    validate,
  };
};
