const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const {
  getByNameCore,
  omitIfEmpty,
  buildTagsObject,
} = require("@grucloud/core/Common");

const { Tagger, assignTags, setup } = require("./MediaConvertCommon");

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

const decorate = ({ endpoint, endpointConfig, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(endpointConfig);
    }),
    assignTags({ buildArn: buildArn(config), endpoint, endpointConfig }),
    omitIfEmpty(["HopDestinations"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html
exports.MediaConvertJobTemplate = () => ({
  type: "JobTemplate",
  package: "mediaconvert",
  client: "MediaConvert",
  propertiesDefault: {
    AccelerationSettings: {
      Mode: "DISABLED",
    },
    Priority: 0,
  },
  omitProperties: ["Arn", "CreatedAt", "LastUpdated"],
  getEndpointConfig: identity,
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
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#getJobTemplate-property
  getById: {
    method: "getJobTemplate",
    getField: "JobTemplate",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#listJobTemplates-property
  getList: {
    method: "listJobTemplates",
    getParam: "JobTemplates",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#createJobTemplate-property
  create: {
    method: "createJobTemplate",
    pickCreated: ({ payload }) => pipe([get("JobTemplate")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#updateJobTemplate-property
  update: {
    method: "updateJobTemplate",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MediaConvert.html#deleteJobTemplate-property
  destroy: {
    method: "deleteJobTemplate",
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
