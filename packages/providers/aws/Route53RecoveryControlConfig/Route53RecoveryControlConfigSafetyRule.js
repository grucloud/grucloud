const assert = require("assert");
const { pipe, tap, get, omit, pick, eq, switchCase, or } = require("rubico");
const { defaultsDeep, when, isEmpty } = require("rubico/x");
const { buildTagsObject, getByNameCore } = require("@grucloud/core/Common");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
  assignTags,
} = require("./Route53RecoveryControlConfigCommon");

const findId = ({ live }) =>
  pipe([
    () => live,
    get("AssertionRule.SafetyRuleArn"),
    when(isEmpty, () => get("GatingRule.SafetyRuleArn")(live)),
  ])();

const pickId = pipe([
  (live) => ({ live }),
  findId,
  tap((SafetyRuleArn) => {
    assert(SafetyRuleArn);
  }),
  (SafetyRuleArn) => ({ SafetyRuleArn }),
]);

const decorate = ({ endpoint }) => pipe([assignTags({ endpoint, findId })]);

const model = ({ config }) => ({
  package: "route53-recovery-control-config",
  client: "Route53RecoveryControlConfig",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#describeSafetyRule-property
  getById: {
    method: "describeSafetyRule",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#createSafetyRule-property
  create: {
    method: "createSafetyRule",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
    isInstanceUp: or([
      eq(get("AssertionRule.Status"), "DEPLOYED"),
      eq(get("GatingRule.Status"), "DEPLOYED"),
    ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#updateSafetyRule-property
  update: {
    method: "updateSafetyRule",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#deleteSafetyRule-property
  destroy: { method: "deleteSafetyRule", pickId },
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html
exports.Route53RecoveryControlConfigSafetyRule = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName: ({ live }) =>
      pipe([
        () => live,
        switchCase([
          get("AssertionRule.Name"),
          get("AssertionRule.Name"),
          get("GatingRule.Name"),
          get("GatingRule.Name"),
          (properties) => {
            assert(false, `no AssertionRule or GatingRule`);
          },
        ]),
        tap((name) => {
          assert(name);
        }),
      ])(),
    findId,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#listSafetyRules-property
    getList: ({ client, endpoint, getById, config }) =>
      pipe([
        tap((params) => {
          assert(client);
          assert(endpoint);
          assert(getById);
          assert(config);
        }),
        () =>
          client.getListWithParent({
            parent: {
              type: "ControlPanel",
              group: "Route53RecoveryControlConfig",
            },
            pickKey: pipe([
              pick(["ControlPanelArn"]),
              tap(({ ControlPanelArn }) => {
                assert(ControlPanelArn);
              }),
            ]),
            method: "listSafetyRules",
            getParam: "SafetyRules",
            decorate: ({ endpoint, lives, parent }) =>
              pipe([
                tap((params) => {
                  assert(true);
                }),
                ({ ASSERTION, GATING }) => ({
                  AssertionRule: ASSERTION,
                  GatingRule: GATING,
                }),
                assignTags({ endpoint, findId }),
              ]),
            config,
          }),
      ])(),
    getByName: getByNameCore,
    tagResource: tagResource({ findId }),
    untagResource: untagResource({ findId }),
    configDefault: ({
      name,
      namespace,
      properties: { Name, Tags, ...otherProps },
      dependencies: { controlPanel },
    }) =>
      pipe([
        tap((params) => {
          assert(controlPanel);
        }),
        () => otherProps,
        defaultsDeep({
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });
