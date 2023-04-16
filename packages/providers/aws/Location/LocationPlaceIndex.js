const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./LocationCommon");

const buildArn = () =>
  pipe([
    get("IndexArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ IndexName }) => {
    assert(IndexName);
  }),
  pick(["IndexName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html
exports.LocationPlaceIndex = () => ({
  type: "PlaceIndex",
  package: "location",
  client: "Location",
  propertiesDefault: {},
  omitProperties: ["IndexArn", "CreateTime", "UpdateTime"],
  inferName: () =>
    pipe([
      get("IndexName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("IndexName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("IndexArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#describePlaceIndex-property
  getById: {
    method: "describePlaceIndex",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#listPlaceIndexes-property
  getList: {
    method: "listPlaceIndexes",
    getParam: "Entries",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#createPlaceIndex-property
  create: {
    method: "createPlaceIndex",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#updatePlaceIndex-property
  update: {
    method: "updatePlaceIndex",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#deletePlaceIndex-property
  destroy: {
    method: "deletePlaceIndex",
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
        Tags: buildTagsObject({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
