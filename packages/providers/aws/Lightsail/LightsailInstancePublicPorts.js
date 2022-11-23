const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { createAwsResource } = require("../AwsClient");

const findName = () =>
  pipe([
    get("instanceName"),
    tap((params) => {
      assert(true);
    }),
  ]);

const pickId = pipe([
  tap(({ instanceName }) => {
    assert(instanceName);
  }),
  pick(["instanceName"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live);
    }),
    ({ portStates }) => ({ portInfos: portStates }),
    defaultsDeep({ instanceName: live.instanceName }),
  ]);

const model = ({ config }) => ({
  package: "lightsail",
  client: "Lightsail",
  ignoreErrorCodes: ["DoesNotExist"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getMyResource-property
  getById: {
    method: "getInstancePortStates",
    //getField: "portStates",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#putInstancePublicPorts-property
  create: {
    method: "putInstancePublicPorts",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  update: {
    method: "putInstancePublicPorts",
    filterParams: ({ pickId, payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#closeInstancePublicPorts-property
  destroy: {
    method: "putInstancePublicPorts",
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      pickId,
      defaultsDeep({ portInfos: [] }),
    ]),
    isInstanceDown: () => true,
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailInstancePublicPorts = ({ compare }) => ({
  type: "InstancePublicPorts",
  propertiesDefault: {},
  omitProperties: ["instanceName", "portInfos[].state"],
  inferName: ({ dependenciesSpec: { instance } }) =>
    pipe([
      tap((params) => {
        assert(instance);
      }),
      () => instance,
    ]),
  dependencies: {
    instance: {
      type: "Instance",
      group: "Lightsail",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("instanceName")]),
    },
  },
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      findName,
      findId: findName,
      getByName: ({ getById }) =>
        pipe([({ name }) => ({ instanceName: name }), getById({})]),
      getList: ({ client, endpoint, getById, config }) =>
        pipe([
          () =>
            client.getListWithParent({
              parent: { type: "Instance", group: "Lightsail" },
              pickKey: pipe([pick(["instanceName"])]),
              method: "getInstancePortStates",
              config,
              decorate: ({ parent }) =>
                pipe([
                  tap((params) => {
                    assert(parent.instanceName);
                  }),
                  ({ portStates }) => ({ portInfos: portStates }),
                  defaultsDeep({ instanceName: parent.instanceName }),
                ]),
            }),
        ])(),
      configDefault: ({
        properties: { ...otherProps },
        dependencies: { instance },
      }) =>
        pipe([
          tap((params) => {
            assert(instance);
          }),
          () => otherProps,
          defaultsDeep({
            instanceName: instance.config.instanceName,
          }),
        ])(),
    }),
});
