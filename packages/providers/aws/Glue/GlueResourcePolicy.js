const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([() => ({})]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap(({ PolicyInJson }) => {
      assert(PolicyInJson);
      assert(config);
    }),
    assign({ PolicyInJson: pipe([get("PolicyInJson"), JSON.parse]) }),
  ]);

const filterPayload = pipe([
  tap(({ PolicyInJson }) => {
    assert(PolicyInJson);
    assert(config);
  }),
  assign({ PolicyInJson: pipe([get("PolicyInJson"), JSON.stringify]) }),
]);

const findName = () => pipe([() => "default"]);

const toPolicyHashCondition = pipe([
  tap(({ PolicyHash }) => {
    assert(PolicyHash);
  }),
  ({ PolicyHash }) => ({ PolicyHashCondition: PolicyHash }),
]);

const ignoreErrorCodes = ["EntityNotFoundException"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueResourcePolicy = () => ({
  type: "ResourcePolicy",
  package: "glue",
  client: "Glue",
  propertiesDefault: {},
  omitProperties: ["CreateTime", "UpdateTime", "PolicyHash"],
  inferName: findName,
  findName,
  findId: findName,
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getResourcePolicy-property
  getById: {
    method: "getResourcePolicy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getResourcePolicy-property
  getList: {
    ignoreErrorCodes,
    method: "getResourcePolicy",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#putResourcePolicy-property
  create: {
    filterPayload: pipe([
      filterPayload,
      defaultsDeep({
        PolicyExistsCondition: "NOT_EXIST",
      }),
    ]),
    method: "putResourcePolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#putResourcePolicy-property
  update: {
    method: "putResourcePolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        filterPayload,
        defaultsDeep({
          PolicyExistsCondition: "MUST_EXIST",
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteResourcePolicy-property
  destroy: {
    method: "deleteResourcePolicy",
    pickId: pipe([toPolicyHashCondition]),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
