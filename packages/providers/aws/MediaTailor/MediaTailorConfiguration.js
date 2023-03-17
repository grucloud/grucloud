const assert = require("assert");
const { pipe, tap, get, pick, eq, tryCatch } = require("rubico");
const { defaultsDeep, first, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./MediaTailorCommon");

const cannotBeDeleted = () => pipe([eq(get("Name"), "Default")]);

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  pick(["Name"]),
]);

const decorate = ({ endpoint, config, endpointConfig }) =>
  pipe([
    tap((params) => {
      assert(endpointConfig);
      assert(endpoint);
    }),
    assignTags({ buildArn: buildArn(config), endpoint, endpointConfig }),
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaTailor.html
exports.MediaTailorConfiguration = () => ({
  type: "Configuration",
  package: "mediatailor",
  client: "MediaTailor",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "CreatedAt",
    "LastUpdated",
    "ProgressingJobsCount",
    "Status",
    "SubmittedJobsCount",
    "Type",
  ],
  inferName: () =>
    pipe([
      get("Name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  ignoreErrorCodes: ["NotFoundException"],
  getEndpointConfig: identity,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaTailor.html#getConfiguration-property
  getById: {
    method: "getConfiguration",
    getField: "Configuration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaTailor.html#listConfigurations-property
  getList: {
    method: "listConfigurations",
    getParam: "Configurations",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaTailor.html#createConfiguration-property
  create: {
    method: "createConfiguration",
    pickCreated: ({ payload }) => pipe([get("Configuration")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaTailor.html#updateConfiguration-property
  update: {
    method: "updateConfiguration",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaTailor.html#deleteConfiguration-property
  destroy: {
    method: "deleteConfiguration",
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
        Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
      }),
    ])(),
});
