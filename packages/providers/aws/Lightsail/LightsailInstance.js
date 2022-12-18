const assert = require("assert");
const { pipe, tap, get, pick, eq, omit, assign } = require("rubico");
const { defaultsDeep, when, pluck } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");

const { Tagger, filterLiveDefault } = require("./LightsailCommon");

const buildArn = () =>
  pipe([
    get("instanceName"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ instanceName }) => {
    assert(instanceName);
  }),
  pick(["instanceName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    ({ name, location, ...other }) => ({
      instanceName: name,
      availabilityZone: location.availabilityZone,

      ...other,
    }),
  ]);

const model = ({ config }) => ({
  package: "lightsail",
  client: "Lightsail",
  ignoreErrorCodes: ["DoesNotExist"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getInstance-property
  getById: {
    method: "getInstance",
    getField: "instance",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getInstances-property
  getList: {
    method: "getInstances",
    getParam: "instances",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createInstance-property
  create: {
    filterPayload: pipe([
      tap(({ instanceName }) => {
        assert(true);
      }),
      ({ instanceName, ...other }) => ({
        instanceNames: [instanceName],
        ...other,
      }),
    ]),
    method: "createInstances",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("state.name"), "running")]),
    // isInstanceError: pipe([eq(get("Status"), "ACTION_NEEDED")]),
    // getErrorMessage: get("stateDetail.message", "error"),
  },
  // TODO
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#updateInstanceMetadataOptions-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#updateInstance-property
  // update: {
  //   method: "updateInstance",
  //   filterParams: ({  payload, diff, live }) =>
  //     pipe([
  //       tap((params) => {
  //         assert(true);
  //       }),
  //       () => payload,
  //     ])(),
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteInstance-property
  destroy: {
    //TODO  forceDeleteAddOns
    method: "deleteInstance",
    pickId,
    // isInstanceDown: pipe([eq(get("status"), "INACTIVE")]),
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailInstance = ({ compare }) => ({
  type: "Instance",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "supportCode",
    "resourceType",
    "createdAt",
    "powerId",
    "state",
    "networking",
    "privateIpAddress",
    "publicIpAddress",
    "ipv6Addresses",
    "isStaticIp",
    "hardware",
    "username",
    "metadataOptions",
  ],
  inferName: () => get("instanceName"),
  compare: compare({
    filterAll: () => pipe([omit(["sshKeyName"])]),
  }),
  filterLive: filterLiveDefault,
  dependencies: {
    keyPair: {
      type: "KeyPair",
      group: "Lightsail",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("sshKeyName"),
          lives.getByName({
            type: "KeyPair",
            group: "Lightsail",
            providerName: config.providerName,
          }),
          get("id"),
        ]),
    },
    disks: {
      type: "Disk",
      group: "Lightsail",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([get("hardware.disks"), pluck("name")]),
    },
  },
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      findName: () =>
        pipe([
          get("instanceName"),
          tap((name) => {
            assert(name);
          }),
        ]),
      findId: () =>
        pipe([
          get("instanceName"),
          tap((id) => {
            assert(id);
          }),
        ]),
      ...Tagger({ buildArn: buildArn(config) }),
      getByName: ({ getById }) =>
        pipe([({ name }) => ({ instanceName: name }), getById({})]),
      update:
        ({ endpoint, getById }) =>
        async ({ payload, live, diff }) =>
          pipe([
            () => diff,
            tap.if(
              or([get("liveDiff.updated.metadataOptions")]),
              pipe([
                tap((params) => {
                  assert(true);
                }),
                () => ({
                  instanceName: payload.instanceName,
                  ...payload.metadataOptions,
                }),
                endpoint().updateInstanceMetadataOptions,
              ])
            ),
          ])(),
      configDefault: ({
        name,
        namespace,
        properties: { tags, ...otherProps },
        dependencies: { keyPair },
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
          when(
            () => keyPair,
            assign({ sshKeyName: () => keyPair.config.keyPairName })
          ),
        ])(),
    }),
});
