const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./LocationCommon");

const buildArn = () =>
  pipe([
    get("TrackerArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ TrackerName }) => {
    assert(TrackerName);
  }),
  pick(["TrackerName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html
exports.LocationTracker = () => ({
  type: "Tracker",
  package: "location",
  client: "Location",
  propertiesDefault: {},
  omitProperties: [
    "CreateTime",
    "KmsKeyId",
    "PricingPlanDataSource",
    "TrackerArn",
    "UpdateTime",
  ],
  inferName: () =>
    pipe([
      get("TrackerName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("TrackerName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("TrackerName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    kmsKey: {
      type: "Key",
      group: "KMS",
      excludeDefaultDependencies: true,
      dependencyId: ({ lives, config }) => get("KmsKeyId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#describeTracker-property
  getById: {
    method: "describeTracker",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#listTrackers-property
  getList: {
    method: "listTrackers",
    getParam: "Entries",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#createTracker-property
  create: {
    method: "createTracker",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#updateTracker-property
  update: {
    method: "updateTracker",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#deleteTracker-property
  destroy: {
    method: "deleteTracker",
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
    dependencies: { kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTagsObject({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => kmsKey,
        defaultsDeep({
          KmsKeyId: getField(kmsKey, "Arn"),
        })
      ),
    ])(),
});
