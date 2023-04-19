const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags, ignoreErrorCodes } = require("./SageMakerCommon");

const buildArn = () =>
  pipe([
    get("DeviceArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

const filterPayload = pipe([
  ({ DeviceFleetName, Tags, ...Device }) => ({
    DeviceFleetName,
    Tags,
    Devices: [Device],
  }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerDevice = () => ({
  type: "Device",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: ["DeviceArn", "RegistrationTime", "Models"],
  inferName: () =>
    pipe([
      get("DeviceName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("DeviceName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("DeviceArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ValidationException"],
  dependencies: {
    deviceFleet: {
      type: "DeviceFleet",
      group: "SageMaker",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("DeviceFleetName"),
          tap((DeviceFleetName) => {
            assert(DeviceFleetName);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeDevice-property
  getById: {
    method: "describeDevice",
    pickId: pipe([
      tap(({ DeviceFleetName, DeviceName }) => {
        assert(DeviceFleetName);
        assert(DeviceName);
      }),
      pick(["DeviceFleetName", "DeviceName"]),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listDevices-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "DeviceFleet", group: "SageMaker" },
          pickKey: pipe([
            pick(["DeviceFleetName"]),
            tap(({ DeviceFleetName }) => {
              assert(DeviceFleetName);
            }),
          ]),
          method: "listDevices",
          getParam: "DeviceSummaries",
          config,
          decorate: () => pipe([getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createDevice-property
  create: {
    filterPayload,
    method: "registerDevices",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#registerDevices-property
  update: {
    method: "registerDevices",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deregisterDevices-property
  destroy: {
    method: "deregisterDevices",
    pickId: pipe([
      tap(({ DeviceFleetName, DeviceName }) => {
        assert(DeviceFleetName);
        assert(DeviceName);
      }),
      ({ DeviceFleetName, DeviceName }) => ({
        DeviceFleetName,
        DeviceNames: [DeviceName],
      }),
    ]),
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { deviceFleet },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(deviceFleet);
      }),
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
        DeviceFleetName: deviceFleet.config.DeviceFleetName,
      }),
    ])(),
});
