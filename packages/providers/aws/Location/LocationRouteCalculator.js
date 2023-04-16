const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger } = require("./LocationCommon");

const buildArn = () =>
  pipe([
    get("CalculatorArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ CalculatorName }) => {
    assert(CalculatorName);
  }),
  pick(["CalculatorName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html
exports.LocationRouteCalculator = () => ({
  type: "RouteCalculator",
  package: "location",
  client: "Location",
  propertiesDefault: {},
  omitProperties: ["CalculatorArn", "CreateTime", "UpdateTime"],
  inferName: () =>
    pipe([
      get("CalculatorName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("CalculatorName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("CalculatorArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#describeRouteCalculator-property
  getById: {
    method: "describeRouteCalculator",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#listRouteCalculators-property
  getList: {
    method: "listRouteCalculators",
    getParam: "Entries",
    decorate: ({ getById }) => pipe([getById]),
  },

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#createRouteCalculator-property
  create: {
    method: "createRouteCalculator",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#updateRouteCalculator-property
  update: {
    method: "updateRouteCalculator",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html#deleteRouteCalculator-property
  destroy: {
    method: "deleteRouteCalculator",
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
