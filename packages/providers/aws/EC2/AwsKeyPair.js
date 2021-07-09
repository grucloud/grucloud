const assert = require("assert");
const { pipe, get, tap, map } = require("rubico");
const { defaultsDeep, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AwsKp" });
const { tos } = require("@grucloud/core/tos");
const { getByNameCore, getByIdCore } = require("@grucloud/core/Common");
const { Ec2New } = require("../AwsCommon");

exports.AwsClientKeyPair = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const ec2 = Ec2New(config);

  const findName = get("live.KeyName");
  const findId = findName;

  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList keypair ${tos(params)}`);
      }),
      () => ec2().describeKeyPairs(params),
      get("KeyPairs"),
      tap((KeyPairs) => {
        logger.debug(`getList keypair: ${tos(KeyPairs)}`);
      }),
      (KeyPairs) => ({
        total: KeyPairs.length,
        items: KeyPairs,
      }),
      tap(({ total }) => {
        logger.info(`getList #keypair: ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });
  //const getById = ({ id }) => getByIdCore({ id, getList, findId });

  const validate = async ({ name }) =>
    pipe([
      tap(() => {
        logger.debug(`validate ${name}`);
      }),
      () => ec2().describeKeyPairs(),
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

  return {
    spec,
    findName,
    findId,
    getByName,
    getList,
    validate,
  };
};
