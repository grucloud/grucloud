const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const fs = require("fs").promises;
const path = require("path");

const { buildTags } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");

const pickId = pipe([
  tap(({ KeyName }) => {
    assert(KeyName);
  }),
  pick(["KeyName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const saveKeyToFile =
  ({ directory = process.cwd() }) =>
  ({ KeyMaterial, KeyName }) =>
    pipe([
      tap(() => {
        //logger.info(`saveKeyToFile '${directory}'`);
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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2KeyPair = () => ({
  type: "KeyPair",
  package: "ec2",
  client: "EC2",
  propertiesDefault: { KeyType: "rsa" },
  omitProperties: ["KeyPairId", "KeyFingerprint", "CreateTime"],
  // inferName: () =>
  //   pipe([
  //     get("KeyName"),
  //     tap((Name) => {
  //       assert(Name);
  //     }),
  //   ]),
  findName: () =>
    pipe([
      get("KeyName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("KeyPairId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["InvalidKeyPair.NotFound"],
  filterLive: () => pick([]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getKeyPair-property
  getById: {
    pickId: ({ KeyName }) => ({ KeyNames: [KeyName] }),
    method: "describeKeyPairs",
    getField: "KeyPairs",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#listKeyPairs-property
  getList: {
    method: "describeKeyPairs",
    getParam: "KeyPairs",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createKeyPair-property
  create: {
    method: "createKeyPair",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    postCreate: ({ programOptions, created }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => created,
        saveKeyToFile({ directory: programOptions.workingDirectory }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteKeyPair-property
  destroy: {
    pickId,
    method: "deleteKeyPair",
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ KeyName: name }), getById({})]),
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
  configDefault: ({
    name,
    properties: { Tags, ...otherProps },
    namespace,
    config,
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
    ])(),
});
