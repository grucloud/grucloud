const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./LightsailCommon");

const buildArn = () =>
  pipe([
    get("keyPairName"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ keyPairName }) => {
    assert(keyPairName);
  }),
  pick(["keyPairName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap(({ name }) => {
      assert(name);
      assert(endpoint);
    }),
    ({ name, ...other }) => ({
      keyPairName: name,
      ...other,
    }),
  ]);

const model = ({ config }) => ({});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailKeyPair = () => ({
  type: "KeyPair",
  package: "lightsail",
  client: "Lightsail",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "supportCode",
    "resourceType",
    "createdAt",
    "fingerprint",
    "location",
  ],
  inferName: () => get("keyPairName"),
  findName: () =>
    pipe([
      get("keyPairName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("keyPairName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ keyPairName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
    ])(),
  ignoreErrorCodes: ["DoesNotExist"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getKeyPair-property
  getById: {
    method: "getKeyPair",
    getField: "keyPair",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getKeyPairs-property
  getList: {
    method: "getKeyPairs",
    getParam: "keyPairs",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createKeyPair-property
  create: {
    method: "createKeyPair",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteKeyPair-property
  destroy: {
    method: "deleteKeyPair",
    pickId,
  },
});
