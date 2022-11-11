const assert = require("assert");
const { pipe, tap, get, pick, map, flatMap, eq } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const { createAwsResource } = require("../AwsClient");

const findName = pipe([
  get("live"),
  ({ loadBalancerName, instanceName }) =>
    `${loadBalancerName}::${instanceName}`,
]);

const pickId = pipe([
  tap(({ loadBalancerName, instanceName }) => {
    assert(loadBalancerName);
    assert(instanceName);
  }),
  ({ loadBalancerName, instanceName }) => ({
    loadBalancerName,
    instanceNames: [instanceName],
  }),
]);

const model = ({ config }) => ({
  package: "lightsail",
  client: "Lightsail",
  ignoreErrorCodes: ["DoesNotExist"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getLoadBalancer-property
  getById: {
    method: "getLoadBalancer",
    getField: "loadBalancer",
    pickId: pipe([
      tap(({ loadBalancerName, instanceName }) => {
        assert(loadBalancerName);
        assert(instanceName);
      }),
      pick(["loadBalancerName"]),
    ]),
    decorate: ({ endpoint, live }) =>
      pipe([
        tap((params) => {
          assert(live);
          assert(live.instanceName);
        }),
        get("instanceHealthSummary"),
        find(eq(get("instanceName"), live.instanceName)),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#attachInstancesToLoadBalancer-property
  create: {
    filterPayload: pipe([pickId]),
    method: "attachInstancesToLoadBalancer",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#detachDisk-property
  destroy: {
    method: "detachInstancesFromLoadBalancer",
    pickId,
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailLoadBalancerAttachment = ({ compare }) => ({
  type: "LoadBalancerAttachment",
  propertiesDefault: {},
  omitProperties: ["loadBalancerName", "instanceName"],
  inferName: pipe([
    get("dependenciesSpec"),
    ({ loadBalancer, instance }) => `${loadBalancer}::${instance}`,
  ]),
  dependencies: {
    loadBalancer: {
      type: "LoadBalancer",
      group: "Lightsail",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("loadBalancerName")]),
    },
    instance: {
      type: "Instance",
      group: "Lightsail",
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
        pipe([
          tap((params) => {
            assert(true);
          }),
          ({ resolvedDependencies: { loadBalancer, instance } }) => ({
            loadBalancerName: loadBalancer.config.loadBalancerName,
            instanceName: instance.config.instanceName,
          }),
          tap((params) => {
            assert(true);
          }),
          getById({}),
        ]),
      getList:
        ({ client, endpoint, getById, config }) =>
        ({ lives }) =>
          pipe([
            () =>
              lives.getByType({
                providerName: config.providerName,
                type: "LoadBalancer",
                group: "Lightsail",
              }),
            flatMap(({ live: { loadBalancerName, instanceHealthSummary } }) =>
              pipe([
                () => instanceHealthSummary,
                map(
                  pipe([
                    pick(["instanceName"]),
                    defaultsDeep({ loadBalancerName }),
                  ])
                ),
              ])()
            ),
          ])(),
      configDefault: ({
        properties: { ...otherProps },
        dependencies: { loadBalancer, instance },
      }) =>
        pipe([
          tap((params) => {
            assert(loadBalancer);
            assert(instance);
            assert(instance.config.instanceName);
          }),
          () => otherProps,
          defaultsDeep({
            loadBalancerName: loadBalancer.config.loadBalancerName,
            instanceName: instance.config.instanceName,
          }),
        ])(),
    }),
});
