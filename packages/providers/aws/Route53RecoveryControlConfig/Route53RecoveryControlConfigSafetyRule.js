const assert = require("assert");
const {
  pipe,
  tap,
  get,
  map,
  omit,
  pick,
  eq,
  switchCase,
  or,
} = require("rubico");
const { defaultsDeep, when, isEmpty } = require("rubico/x");
const { buildTagsObject, getByNameCore } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./Route53RecoveryControlConfigCommon");

const findId = () => (live) =>
  pipe([
    () => live,
    get("AssertionRule.SafetyRuleArn"),
    when(isEmpty, () => get("GatingRule.SafetyRuleArn")(live)),
  ])();

const buildArn = () =>
  pipe([
    get("SafetyRuleArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  findId(),
  tap((SafetyRuleArn) => {
    assert(SafetyRuleArn);
  }),
  (SafetyRuleArn) => ({ SafetyRuleArn }),
]);

const filterLiveRule = ({ lives, providerConfig }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    assign({
      AssertedControls: pipe([
        get("AssertedControls"),
        map(
          replaceWithName({
            groupType: "Route53RecoveryControlConfig::RoutingControl",
            providerConfig,
            lives,
            path: "id",
          })
        ),
      ]),
      ControlPanelArn: pipe([
        get("ControlPanelArn"),
        replaceWithName({
          groupType: "Route53RecoveryControlConfig::ControlPanel",
          providerConfig,
          lives,
          path: "id",
        }),
      ]),
    }),
  ]);

const decorate = ({ endpoint }) =>
  pipe([assignTags({ endpoint, findId: findId() })]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html
exports.Route53RecoveryControlConfigSafetyRule = ({}) => ({
  type: "SafetyRule",
  package: "route53-recovery-control-config",
  client: "Route53RecoveryControlConfig",
  region: "us-west-2",
  inferName: () =>
    pipe([
      switchCase([
        get("AssertionRule.Name"),
        get("AssertionRule.Name"),
        get("GatingRule.Name"),
        get("GatingRule.Name"),
        (properties) => {
          assert(false, `no AssertionRule or GatingRule`);
        },
      ]),
    ]),
  findName: () =>
    pipe([
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
    ]),
  findId,
  dependencies: {
    controlPanel: {
      type: "ControlPanel",
      group: "Route53RecoveryControlConfig",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          (live) =>
            get("AssertionRule.ControlPanelArn")(live) ||
            get("GatingRule.ControlPanelArn")(live),
        ]),
    },
    routingControls: {
      type: "RoutingControl",
      group: "Route53RecoveryControlConfig",
      list: true,
      dependencyIds:
        ({ lives, config }) =>
        (live) =>
          pipe([
            () => live,
            get("AssertionRule.AssertedControls"),
            when(isEmpty, () => get("GatingRule.AssertedControls", [])(live)),
          ])(),
    },
  },
  omitProperties: [
    "AssertionRule.SafetyRuleArn",
    "AssertionRule.Status",
    "GatingRule.SafetyRuleArn",
    "GatingRule.Status",
  ],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      switchCase([
        get("AssertionRule"),
        assign({
          AssertionRule: pipe([
            get("AssertionRule"),
            filterLiveRule({ lives, providerConfig }),
          ]),
        }),
        get("GatingRule"),
        assign({
          GatingRule: pipe([
            get("GatingRule"),
            filterLiveRule({ lives, providerConfig }),
          ]),
        }),
        (live) => {
          assert(false, "AssertionRule or GatingRule");
        },
      ]),
    ]),
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
              assignTags({ endpoint, findId: findId() }),
            ]),
          config,
        }),
    ])(),
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
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Name, Tags, ...otherProps },
    dependencies: { controlPanel },
    config,
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
