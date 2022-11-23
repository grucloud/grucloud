const assert = require("assert");
const { pipe, tap, get, pick, eq, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { createAwsResource } = require("../AwsClient");

const { Tagger, filterLiveDefault } = require("./LightsailCommon");

const buildArn = () =>
  pipe([
    get("diskName"),
    tap((arn) => {
      assert(arn);
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
    tap(({ name }) => {
      assert(name);
      assert(endpoint);
    }),
    ({ name, location, ...other }) => ({
      diskName: name,
      availabilityZone: location.availabilityZone,
      ...other,
    }),
  ]);

const managedByOther = () => pipe([get("isSystemDisk")]);

const model = ({ config }) => ({
  package: "lightsail",
  client: "Lightsail",
  ignoreErrorCodes: ["DoesNotExist"],
  managedByOther,
  cannotBeDeleted: managedByOther,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getDisk-property
  getById: {
    method: "getDisk",
    getField: "disk",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#getDisks-property
  getList: {
    method: "getDisks",
    getParam: "disks",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#createDisk-property
  create: {
    method: "createDisk",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: pipe([eq(get("state"), "available")]),
    isInstanceError: pipe([eq(get("state"), "error")]),
    // getErrorMessage: get("StatusMessage", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#deleteDisk-property
  destroy: {
    method: "deleteDisk",
    pickId,
    shouldRetryOnExceptionMessages: [
      "You can't perform this operation since the resource is in transition",
    ],
  },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html
exports.LightsailDisk = ({ compare }) => ({
  type: "Disk",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "supportCode",
    "resourceType",
    "createdAt",
    "state",
    "attachedTo",
    "isAttached",
    "attachmentState",
    "gbInUse",
    "isSystemDisk",
  ],
  compare: compare({
    filterAll: () => pipe([omit(["path"])]),
  }),
  inferName: () => get("diskName"),
  filterLive: filterLiveDefault,
  Client: ({ spec, config }) =>
    createAwsResource({
      model: model({ config }),
      spec,
      config,
      findName: () =>
        pipe([
          get("diskName"),
          tap((name) => {
            assert(name);
          }),
        ]),
      findId: () =>
        pipe([
          get("diskName"),
          tap((id) => {
            assert(id);
          }),
        ]),
      getByName: ({ getById }) =>
        pipe([({ name }) => ({ diskName: name }), getById({})]),
      ...Tagger({ buildArn: buildArn(config) }),
      configDefault: ({
        name,
        namespace,
        properties: { tags, ...otherProps },
        dependencies: {},
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
    }),
});
