const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { ignoreErrorCodes } = require("./SecurityHubCommon");

const pickId = pipe([
  tap(({ ActionTargetArn }) => {
    assert(ActionTargetArn);
  }),
  pick(["ActionTargetArn"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html
exports.SecurityHubActionTarget = () => ({
  type: "ActionTarget",
  package: "securityhub",
  client: "SecurityHub",
  propertiesDefault: {},
  omitProperties: ["ActionTargetArn"],
  inferName: pipe([
    get("properties.Name"),
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
      get("ActionTargetArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    securityHubAccount: {
      type: "Account",
      group: "SecurityHub",
      dependencyId: ({ lives, config }) => pipe([() => "default"]),
    },
  },
  ignoreErrorCodes,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#getActionTarget-property
  getById: {
    method: "describeActionTargets",
    getField: "ActionTargets",
    pickId: pipe([
      tap(({ ActionTargetArn }) => {
        assert(ActionTargetArn);
      }),
      ({ ActionTargetArn }) => ({
        ActionTargetArns: [ActionTargetArn],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#listActionTargets-property
  getList: {
    method: "describeActionTargets",
    getParam: "ActionTargets",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#createActionTarget-property
  create: {
    method: "createActionTarget",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#updateActionTarget-property
  update: {
    method: "updateActionTarget",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([
        //
        () => payload,
        defaultsDeep(pickId(live)),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html#deleteActionTarget-property
  destroy: {
    method: "deleteActionTarget",
    pickId,
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
