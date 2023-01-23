const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  map,
  not,
  filter,
  switchCase,
} = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const findName = () =>
  pipe([
    get("staticIpName"),
    tap((name) => {
      assert(name);
    }),
  ]);

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
    }),
    switchCase([
      get("isAttached"),
      ({ name, attachedTo }) => ({
        staticIpName: name,
        instanceName: attachedTo,
      }),
      () => undefined,
    ]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailStaticIpAttachment = ({ compare }) => ({
  type: "StaticIpAttachment",
  package: "lightsail",
  client: "Lightsail",
  propertiesDefault: {},
  omitProperties: ["staticIpName", "instanceName"],
  inferName: ({ dependenciesSpec: { staticIp } }) =>
    pipe([
      tap((params) => {
        assert(staticIp);
      }),
      () => staticIp,
    ]),
  dependencies: {
    staticIp: {
      type: "StaticIp",
      group: "Lightsail",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("staticIpName")]),
    },
    instance: {
      type: "Instance",
      group: "Lightsail",
      dependencyId: ({ lives, config }) => pipe([get("instanceName")]),
    },
  },
  findName,
  findId: findName,
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ staticIpName: name }), getById({})]),
  getList:
    ({ client, endpoint, getById, config }) =>
    ({ lives }) =>
      pipe([
        lives.getByType({
          providerName: config.providerName,
          type: "StaticIp",
          group: "Lightsail",
        }),
        map(
          pipe([
            get("live"),
            ({ staticIpName, ...other }) => ({
              name: staticIpName,
              ...other,
            }),
            decorate({}),
          ])
        ),
        filter(not(isEmpty)),
        tap((params) => {
          assert(true);
        }),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { staticIp, instance },
  }) =>
    pipe([
      tap((params) => {
        assert(staticIp);
        assert(staticIp.config.staticIpName);
        assert(instance);
        assert(instance.config.instanceName);
      }),
      () => otherProps,
      defaultsDeep({
        instanceName: instance.config.instanceName,
        staticIpName: staticIp.config.staticIpName,
      }),
    ])(),
  ignoreErrorCodes: ["DoesNotExist"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getMyResource-property
  getById: {
    method: "getStaticIp",
    getField: "staticIp",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#attachStaticIp-property
  create: {
    method: "attachStaticIp",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#detachStaticIp-property
  destroy: {
    method: "detachStaticIp",
    pickId,
  },
});
