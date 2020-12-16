const assert = require("assert");
const AWS = require("aws-sdk");
const { pipe, get, tap, map } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "AwsKp" });
const { tos } = require("../../../tos");
const { getByNameCore, findField } = require("../../Common");

module.exports = AwsClientKeyPair = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const ec2 = new AWS.EC2({ region: config.region });

  const findName = (item) => findField({ item, field: "KeyName" });
  const findId = (item) => findField({ item, field: "KeyPairId" });

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });
  const getById = ({ id }) => getByIdCore({ id, getList, findId });

  const getList = async ({ params } = {}) => {
    logger.debug(`list keypair params: ${tos(params)}`);
    const { KeyPairs } = await ec2.describeKeyPairs(params).promise();
    logger.debug(`list keypair: ${tos(KeyPairs)}`);

    return {
      total: KeyPairs.length,
      items: KeyPairs,
    };
  };

  const validate = async ({ name }) =>
    pipe([
      tap(() => {
        logger.debug(`validate ${name}`);
      }),
      () => ec2.describeKeyPairs().promise(),
      get("KeyPairs"),
      pluck("KeyName"),
      tap.if(
        (names) => !names.includes(name),
        (names) => {
          throw {
            code: 400,
            message: `The KeyPair '${name}' is not registered on AWS. ${
              names.length === 0
                ? "No key pairs exists"
                : `Available key pairs: ${names.join(",")}`
            }.\nVisit https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html to create a new key pair`,
          };
        }
      ),
    ])();

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
