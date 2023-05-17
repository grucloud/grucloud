const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { assignTags } = require("./PinpointCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ ApplicationId }) => {
    assert(ApplicationId);
  }),
  pick(["ApplicationId"]),
]);

const toApplicationId = ({ Id, ...other }) => ({ ApplicationId: Id, ...other });

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toApplicationId,
    assignTags({ endpoint, buildArn: buildArn() }),
  ]);

const filterPayload = (CreateApplicationRequest) => ({
  CreateApplicationRequest,
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html
exports.PinpointApp = () => ({
  type: "App",
  package: "pinpoint",
  client: "Pinpoint",
  propertiesDefault: {},
  omitProperties: ["ApplicationId", "CreationDate", "Arn"],
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
      get("ApplicationId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#getApp-property
  getById: {
    method: "getApp",
    getField: "ApplicationResponse",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#getApps-property
  getList: {
    method: "getApps",
    getParam: "ApplicationsResponse.Item",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#createApp-property
  create: {
    filterPayload,
    method: "createApp",
    pickCreated: ({ payload }) =>
      pipe([get("ApplicationResponse"), toApplicationId]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#updateApp-property
  update: {
    method: "updateApplicationSettings",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Pinpoint.html#deleteApp-property
  destroy: {
    method: "deleteApp",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({
    tagResource:
      ({ endpoint }) =>
      ({ live }) =>
        pipe([
          tap((tags) => {
            assert(tags);
            assert(endpoint);
          }),
          (tags) => ({
            ResourceArn: buildArn()(live),
            TagsModel: {
              tags,
            },
          }),
          endpoint().tagResource,
        ]),
    untagResource:
      ({ endpoint }) =>
      ({ live }) =>
        pipe([
          tap((TagKeys) => {
            assert(TagKeys);
            assert(endpoint);
          }),
          (TagKeys) => ({
            ResourceArn: buildArn()(live),
            TagKeys,
          }),
          endpoint().untagResource,
        ]),
  }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
