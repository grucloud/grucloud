const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const pickId = pipe([
  tap(({ staticIpName }) => {
    assert(staticIpName);
  }),
  pick(["staticIpName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap(({ name }) => {
      assert(name);
      assert(endpoint);
    }),
    ({ name, ...other }) => ({ staticIpName: name, ...other }),
  ]);

const model = ({ config }) => ({});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailStaticIp = () => ({
  type: "StaticIp",
  package: "lightsail",
  client: "Lightsail",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "supportCode",
    "resourceType",
    "createdAt",
    "isAttached",
    "attachedTo",
    "ipAddress",
    "location",
  ],
  inferName: () => get("staticIpName"),
  findName: () =>
    pipe([
      get("staticIpName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("staticIpName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ staticIpName: name }), getById({})]),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
  }) => pipe([() => otherProps])(),
  ignoreErrorCodes: ["DoesNotExist"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getStaticIp-property
  getById: {
    method: "getStaticIp",
    getField: "staticIp",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getStaticIps-property
  getList: {
    method: "getStaticIps",
    getParam: "staticIps",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#allocateStaticIp-property
  create: {
    method: "allocateStaticIp",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteStaticIp-property
  destroy: {
    method: "releaseStaticIp",
    pickId,
  },
});
