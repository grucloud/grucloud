const assert = require("assert");
const { pipe, get, tap, not, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const fs = require("fs").promises;
const path = require("path");
const logger = require("@grucloud/core/logger")({ prefix: "AwsKp" });
const { buildTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2, tagResource, untagResource } = require("./EC2Common");

exports.AwsClientKeyPair = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const findName = get("live.KeyName");
  const findId = findName;
  const pickId = pick(["KeyName"]);

  const getList = client.getList({
    method: "describeKeyPairs",
    getParam: "KeyPairs",
  });

  const getById = client.getById({
    pickId: ({ KeyName }) => ({ KeyNames: [KeyName] }),
    method: "describeKeyPairs",
    getField: "KeyPairs",
    ignoreErrorCodes: ["InvalidKeyPair.NotFound"],
  });

  const getByName = pipe([({ name }) => ({ KeyName: name }), getById]);

  const saveKeyToFile =
    ({ directory = process.cwd() }) =>
    ({ KeyMaterial, KeyName }) =>
      pipe([
        tap(() => {
          logger.info(`saveKeyToFile '${directory}'`);
          assert(KeyMaterial);
          assert(KeyName);
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
  const create = client.create({
    method: "createKeyPair",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    getById,
    postCreate: ({ programOptions, created }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => created,
        saveKeyToFile({ directory: programOptions.workingDirectory }),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteKeyPair-property
  const destroy = client.destroy({
    pickId,
    method: "deleteKeyPair",
    getById,
    ignoreErrorCodes: ["InvalidKeyPair.NotFound"],
  });

  const configDefault = ({
    name,
    properties: { Tags, ...otherProps },
    namespace,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        KeyName: name,
        TagSpecifications: [
          {
            ResourceType: "key-pair",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
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
    tagResource: tagResource({ ec2 }),
    untagResource: untagResource({ ec2 }),
  };
};
