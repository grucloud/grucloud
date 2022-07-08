const assert = require("assert");
const { pipe, tap, get, omit, pick, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { buildTagsObject, getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { createAwsResource } = require("../AwsClient");
const {
  tagResource,
  untagResource,
} = require("./Route53RecoveryControlConfigCommon");

const pickId = pipe([
  pick(["SafetyRuleArn"]),
  tap(({ SafetyRuleArn }) => {
    assert(SafetyRuleArn);
  }),
]);

const model = ({ config }) => ({
  package: "route53-recovery-control-config",
  client: "Route53RecoveryControlConfig",
  region: "us-west-2",
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#describeSafetyRule-property
  getById: {
    method: "describeSafetyRule",
    pickId,
    //getField: "SafetyRule",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#createSafetyRule-property
  create: {
    method: "createSafetyRule",
    pickCreated: ({ payload }) => pipe([pick(["SafetyRuleArn"])]),
    isInstanceUp: eq(get("Status"), "DEPLOYED"),
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
    findName: pipe([get("live.Name")]),
    findId: pipe([get("live.SafetyRuleArn")]),
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
              tap(({ ControlPanelArn }) => {
                assert(ControlPanelArn);
              }),
              pick(["ControlPanelArn"]),
            ]),
            method: "listSafetyRules",
            getParam: "SafetyRules",
            decorate: ({ endpoint, lives, parent }) =>
              pipe([
                tap((params) => {
                  assert(true);
                }),
                //TODO https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#listAssociatedRoute53HealthChecks-property
              ]),
            config,
          }),
      ])(),
    getByName: getByNameCore,
    tagResource: tagResource({ property: "SafetyRuleArn" }),
    untagResource: untagResource({ property: "SafetyRuleArn" }),
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
          AssertionRule: {
            ControlPanelArn: getField(controlPanel, "ControlPanelArn"),
          },
          GatingRule: {
            ControlPanelArn: getField(controlPanel, "ControlPanelArn"),
          },
          Tags: buildTagsObject({ name, config, namespace, userTags: Tags }),
        }),
      ])(),
  });
