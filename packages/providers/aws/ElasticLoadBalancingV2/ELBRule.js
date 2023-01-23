const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  assign,
  map,
  or,
  switchCase,
  omit,
} = require("rubico");
const {
  defaultsDeep,
  first,
  pluck,
  when,
  unless,
  prepend,
  append,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { hasDependency } = require("@grucloud/core/generatorUtils");

const { tagResource, untagResource } = require("./ELBCommon");

const pickId = pipe([
  tap(({ RuleArn }) => {
    assert(RuleArn);
  }),
  pick(["RuleArn"]),
]);

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(live.ListenerArn);
      }),
      () => live,
      get("ListenerArn"),
      lives.getById({
        type: "Listener",
        group: "ElasticLoadBalancingV2",
        providerName: config.providerName,
      }),
      tap((listener) => {
        assert(listener);
      }),
      get("name"),
      tap((listenerName) => {
        assert(listenerName);
      }),
      switchCase([
        () => live.IsDefault,
        prepend("rule-default-"),
        prepend("rule::"),
      ]),
      append(`::${live.Priority}`),
    ])();

const isDefault = () => get("IsDefault");

const managedByOther = ({ lives, config }) =>
  pipe([
    or([
      isDefault({ lives, config }),
      (live) =>
        pipe([
          tap(() => {
            assert(lives);
            assert(live.ListenerArn);
          }),
          () => live,
          get("ListenerArn"),
          lives.getById({
            type: "Listener",
            group: "ElasticLoadBalancingV2",
            providerName: config.providerName,
          }),
          tap((listener) => {
            assert(listener);
          }),
          get("live.LoadBalancerArn"),
          tap((LoadBalancerArn) => {
            assert(LoadBalancerArn);
          }),
          lives.getById({
            type: "LoadBalancer",
            group: "ElasticLoadBalancingV2",
            providerName: config.providerName,
          }),
          get("managedByOther"),
        ])(),
    ]),
  ]);

// const findNamespaceInListener =
//   ({ lives, config }) =>
//   (live) =>
//     pipe([
//       () => live,
//       get("ListenerArn"),
//       lives.getById({
//         providerName: config.providerName,
//         type: "Listener",
//         group: "ElasticLoadBalancingV2",
//       }),
//       tap((listener) => {
//         assert(listener);
//       }),
//       get("namespace"),
//       tap((namespace) => {
//         assert(true);
//       }),
//     ])();

// const findNamespace =
//   ({ lives, config }) =>
//   (live) =>
//     pipe([
//       () => live,
//       findNamespaceInTags({ lives, config }),
//       switchCase([
//         not(isEmpty),
//         identity,
//         findNamespaceInListener({ lives, config }),
//       ]),
//       tap((namespace) => {
//         logger.debug(`findNamespace rules ${namespace}`);
//       }),
//     ])();

// TODO assigTags

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const targetGroupProperties = ({ targetGroup }) =>
  when(
    () => targetGroup,
    () => ({
      Actions: [
        {
          Type: "forward",
          TargetGroupArn: getField(targetGroup, "TargetGroupArn"),
          Order: 1,
          ForwardConfig: {
            TargetGroups: [
              {
                TargetGroupArn: getField(targetGroup, "TargetGroupArn"),
                Weight: 1,
              },
            ],
            TargetGroupStickinessConfig: {
              Enabled: false,
            },
          },
        },
      ],
    })
  )();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html
exports.ElasticLoadBalancingV2Rule = ({ compare }) => ({
  type: "Rule",
  package: "elastic-load-balancing-v2",
  client: "ElasticLoadBalancingV2",
  propertiesDefault: {},
  omitProperties: [],
  inferName:
    ({ dependenciesSpec: { listener } }) =>
    ({ Priority }) =>
      pipe([
        tap(() => {
          assert(listener);
          assert(Priority);
        }),
        () => `rule::${listener}::${Priority}`,
      ])(),
  findName,
  findId: () =>
    pipe([
      get("RuleArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther,
  isDefault,
  cannotBeDeleted: isDefault,
  ignoreErrorCodes: ["RuleNotFound", "RuleNotFoundException"],
  dependencies: {
    listener: {
      type: "Listener",
      group: "ElasticLoadBalancingV2",
      parent: true,
      dependencyId: ({ lives, config }) => get("ListenerArn"),
    },
    targetGroup: {
      type: "TargetGroup",
      group: "ElasticLoadBalancingV2",
      //TODO list ?
      dependencyIds: ({ lives, config }) =>
        pipe([get("Actions"), pluck("TargetGroupArn")]),
    },
  },
  omitProperties: [
    "RuleArn",
    "TargetGroupName",
    "HealthCheckProtocol",
    "LoadBalancerArns",
  ],
  propertiesDefault: {
    IsDefault: false,
  },
  compare: compare({
    filterTarget: () =>
      pipe([
        unless(
          get("Conditions[0].Values"),
          assign({
            Conditions: () => [
              {
                Field: "path-pattern",
                Values: ["/*"],
              },
            ],
          })
        ),
      ]),
    filterLive: () =>
      pipe([
        assign({
          Conditions: pipe([
            get("Conditions"),
            map(omit(["PathPatternConfig"])),
          ]),
        }),
      ]),
  }),
  filterLive: pipe([
    ({ resource }) =>
      (live) =>
        pipe([
          () => live,
          when(
            () =>
              hasDependency({
                type: "TargetGroup",
                group: "ElasticLoadBalancingV2",
              })(resource),
            omit(["Actions"])
          ),
          pick(["Priority", "Conditions", "Actions"]),
          assign({
            Conditions: pipe([
              get("Conditions"),
              map(omit(["PathPatternConfig"])),
            ]),
          }),
        ])(),
  ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#getRule-property
  getById: {
    pickId: ({ RuleArn }) => ({ RuleArns: [RuleArn] }),
    method: "describeRules",
    getField: "Rules",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#listRules-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Listener", group: "ElasticLoadBalancingV2" },
          pickKey: pick(["ListenerArn"]),
          method: "describeRules",
          getParam: "Rules",
          config,
          decorate: ({ lives, parent: { ListenerArn } }) =>
            pipe([
              assign({
                Tags: pipe([
                  ({ RuleArn }) => ({ ResourceArns: [RuleArn] }),
                  endpoint().describeTags,
                  get("TagDescriptions"),
                  first,
                  get("Tags"),
                ]),
                ListenerArn: () => ListenerArn,
              }),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#createRule-property
  create: {
    method: "createRule",
    pickCreated: () => pipe([get("Rules"), first]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#updateRule-property
  //TODO
  // update: {
  //   method: "updateRule",
  //   filterParams: ({ payload, diff, live }) =>
  //     pipe([() => payload, defaultsDeep(pickId(live))])(),
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticLoadBalancingV2.html#deleteRule-property
  destroy: {
    method: "deleteRule",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) => ({ tagResource, untagResource }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { listener, targetGroup },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(listener);
      }),
      () => ({}),
      defaultsDeep(targetGroupProperties({ targetGroup })),
      defaultsDeep(otherProps),
      defaultsDeep({
        ListenerArn: getField(listener, "ListenerArn"),
        Tags: buildTags({ name, namespace, config, UserTags: Tags }),
      }),
    ])(),
});
