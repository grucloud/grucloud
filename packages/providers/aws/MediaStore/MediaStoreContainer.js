const assert = require("assert");
const { pipe, tap, get, pick, eq, tryCatch } = require("rubico");
const { defaultsDeep, first, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./MediaStoreCommon");
const { buildTags } = require("../AwsCommon");

const toContainerName = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  ({ Name, ...other }) => ({ ContainerName: Name, ...other }),
]);

const buildArn = () =>
  pipe([
    get("ARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ContainerName }) => {
    assert(ContainerName);
  }),
  pick(["ContainerName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toContainerName,
    assignTags({ buildArn: buildArn(config), endpoint }),
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaStore.html
exports.MediaStoreContainer = () => ({
  type: "Container",
  package: "mediastore",
  client: "MediaStore",
  propertiesDefault: {},
  omitProperties: [
    "ARN",
    "Endpoint",
    "CreationTime",
    "Status",
    "AccessLoggingEnabled",
  ],
  inferName: () =>
    pipe([
      get("ContainerName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("ContainerName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ARN"),
      tap((id) => {
        assert(id);
      }),
    ]),
  // cannotBeDeleted,
  // managedByOther: cannotBeDeleted,
  ignoreErrorCodes: ["ContainerNotFoundException"],
  getEndpointConfig: identity,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaStore.html#describeContainer-property
  getById: {
    method: "describeContainer",
    getField: "Container",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaStore.html#listContainers-property
  getList: {
    method: "listContainers",
    getParam: "Containers",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaStore.html#createContainer-property
  create: {
    method: "createContainer",
    pickCreated: ({ payload }) => pipe([identity]),
    // Status  ACTIVE
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaStore.html#deleteContainer-property
  destroy: {
    method: "deleteContainer",
    pickId,
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
