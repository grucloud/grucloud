const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./SESV2Common");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ PoolName }) => {
    assert(PoolName);
  }),
  pick(["PoolName"]),
]);

const assignArn = ({ config }) =>
  pipe([
    tap(({ PoolName }) => {
      assert(PoolName);
    }),
    ({ PoolName }) =>
      `arn:aws:ses:${
        config.region
      }:${config.accountId()}:dedicated-ip-pool/${PoolName}`,
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignArn({ config }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html
exports.SESV2DedicatedIpPool = ({ compare }) => ({
  type: "DedicatedIpPool",
  package: "sesv2",
  client: "SESv2",
  propertiesDefault: {},
  omitProperties: ["Arn"],
  inferName: () =>
    pipe([
      get("PoolName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("PoolName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("PoolName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#getDedicatedIpPool-property
  getById: {
    method: "getDedicatedIpPool",
    getField: "DedicatedIpPool",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#listDedicatedIpPools-property
  getList: {
    method: "listDedicatedIpPools",
    getParam: "DedicatedIpPools",
    decorate: ({ getById }) => pipe([(PoolName) => ({ PoolName }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#createDedicatedIpPool-property
  create: {
    method: "createDedicatedIpPool",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SESV2.html#deleteDedicatedIpPool-property
  destroy: {
    method: "deleteDedicatedIpPool",
    pickId,
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ PoolName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
