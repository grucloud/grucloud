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

const { createAwsResource } = require("../AwsClient");

const findName = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    get("diskName"),
    tap((name) => {
      assert(name);
    }),
  ]);

const pickId = pipe([
  tap(({ diskName }) => {
    assert(diskName);
  }),
  pick(["diskName"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((param) => {
      assert(param);
    }),
    switchCase([
      get("isAttached"),
      ({ name, attachedTo, path }) => ({
        diskName: name,
        instanceName: attachedTo,
        diskPath: path,
      }),
      () => undefined,
    ]),
    tap((params) => {
      assert(true);
    }),
  ]);

const model = ({ config }) => ({
  package: "lightsail",
  client: "Lightsail",
  ignoreErrorCodes: ["DoesNotExist"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getMyResource-property
  getById: {
    method: "getDisk",
    getField: "disk",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#attachDisk-property
  create: {
    method: "attachDisk",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#detachDisk-property
  destroy: {
    method: "detachDisk",
    pickId,
    ignoreErrorMessages: [
      "You can only detach the disk when the target instance is stopped",
    ],
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailDiskAttachment = ({ compare }) => ({
  type: "DiskAttachment",
  propertiesDefault: {},
  omitProperties: ["diskName", "instanceName"],
  inferName: ({ dependenciesSpec: { disk } }) =>
    pipe([
      tap((params) => {
        assert(disk);
      }),
      () => disk,
    ]),
  dependencies: {
    disk: {
      type: "Disk",
      group: "Lightsail",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("diskName")]),
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
        pipe([({ name }) => ({ diskName: name }), getById({})]),
      getList:
        ({ client, endpoint, getById }) =>
        ({ lives, config }) =>
          pipe([
            tap((params) => {
              assert(config);
            }),
            lives.getByType({
              providerName: config.providerName,
              type: "Disk",
              group: "Lightsail",
            }),
            map(
              pipe([
                get("live"),
                ({ diskName, ...other }) => ({
                  name: diskName,
                  ...other,
                }),
                decorate({}),
              ])
            ),
            filter(not(isEmpty)),
          ])(),
      configDefault: ({
        name,
        namespace,
        properties: { ...otherProps },
        dependencies: { disk, instance },
      }) =>
        pipe([
          tap((params) => {
            assert(disk);
            assert(instance);
            assert(instance.config.instanceName);
            assert(disk.config.diskName);
          }),
          () => otherProps,
          defaultsDeep({
            instanceName: instance.config.instanceName,
            diskName: disk.config.diskName,
            diskPath: "/dev/xvdf",
          }),
        ])(),
    }),
});
