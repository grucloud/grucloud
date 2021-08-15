const assert = require("assert");
const { pipe, get, tap, not } = require("rubico");
const { defaultsDeep, pluck, first, includes, isEmpty } = require("rubico/x");
const fs = require("fs").promises;
const path = require("path");
const { retryCall } = require("@grucloud/core/Retry");
const logger = require("@grucloud/core/logger")({ prefix: "AwsKp" });
const { tos } = require("@grucloud/core/tos");
const { Ec2New, buildTags } = require("../AwsCommon");

exports.AwsClientKeyPair = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const ec2 = Ec2New(config);

  const findName = get("live.KeyName");
  const findId = findName;

  //TODO add describeKeyPairs
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList keypair ${tos(params)}`);
      }),
      () => ec2().describeKeyPairs(params),
      get("KeyPairs"),
    ])();

  const getByName = async ({ name } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      () => ec2().describeKeyPairs({ KeyNames: [name] }),
      get("KeyPairs"),
      first,
      tap((KeyPair) => {
        logger.debug(`getByName keypair: ${tos(KeyPair)}`);
      }),
    ])();

  const isUpByName = pipe([getByName, not(isEmpty)]);

  const saveKeyToFile =
    ({ directory = process.cwd() }) =>
    ({ KeyMaterial, KeyName }) =>
      pipe([
        tap(() => {
          logger.info(`saveKeyToFile '${directory}'`);
        }),
        () =>
          fs.writeFile(
            path.resolve(directory, `${KeyName}.pem`),
            KeyMaterial,
            "utf8"
          ),
        () => fs.chmod(path.resolve(directory, `${KeyName}.pem`), "600"),
      ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createKeyPair-property
  const create = ({ payload, name, programOptions }) =>
    pipe([
      tap(() => {
        logger.info(`create keyPair ${name}`);
        assert(programOptions.workingDirectory);
      }),
      () => ec2().createKeyPair(payload),
      tap(saveKeyToFile({ directory: programOptions.workingDirectory })),
      tap(() =>
        retryCall({
          name: `keyPair isUpByName: ${name}`,
          fn: () => isUpByName({ name }),
        })
      ),

      tap((result) => {
        logger.info(`keyPair created ${tos(result)}`);
      }),
      ({ KeyPairId }) => ({ id: KeyPairId }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteKeyPair-property
  const destroy = async ({ id, name, live }) =>
    pipe([
      tap(() => {
        logger.info(`destroy keyPair ${JSON.stringify({ name, id })}`);
      }),
      () => ec2().deleteKeyPair({ KeyName: name }),
      tap(() => {
        logger.debug(`destroyed keyPair ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, namespace }) =>
    pipe([
      () => properties,
      defaultsDeep({
        KeyName: name,
        TagSpecifications: [
          {
            ResourceType: "key-pair",
            Tags: buildTags({ config, namespace, name }),
          },
        ],
      }),
    ])();

  const validate = ({ name }) =>
    pipe([
      tap(() => {
        logger.debug(`validate ${name}`);
      }),
      () => ec2().describeKeyPairs(),
      get("KeyPairs"),
      pluck("KeyName"),
      // tap.if(not(includes(name)), (names) => {
      //   throw {
      //     code: 400,
      //     message: `The KeyPair '${name}' is not registered on AWS. ${
      //       names.length === 0
      //         ? "No key pairs exists"
      //         : `Available key pairs: ${names.join(",")}`
      //     }.\nVisit https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html to create a new key pair`,
      //   };
      // }),
    ])();

  return {
    spec,
    findName,
    findId,
    getByName,
    getList,
    create,
    destroy,
    configDefault,
    validate,
  };
};
