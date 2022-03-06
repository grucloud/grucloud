const assert = require("assert");
const { pipe, tap, get, not, switchCase, assign, or, pick } = require("rubico");
const {
  first,
  defaultsDeep,
  isEmpty,
  pluck,
  identity,
  prepend,
  append,
} = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const logger = require("@grucloud/core/logger")({ prefix: "ELBRule" });
const { buildTags, findNamespaceInTags } = require("../AwsCommon");

const findId = get("live.RuleArn");

const pickId = pick(["RuleArn"]);

const { AwsClient } = require("../AwsClient");
const { createELB } = require("./ELBCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html
exports.ELBRule = ({ spec, config }) => {
  const elb = createELB(config);
  const client = AwsClient({ spec, config })(elb);

  const findName = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(live.ListenerArn);
      }),
      () =>
        lives.getById({
          type: "Listener",
          group: "ELBv2",
          id: live.ListenerArn,
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

  const isDefault = get("live.IsDefault");

  const managedByOther = pipe([
    tap((params) => {
      assert(true);
    }),
    or([
      isDefault,
      ({ live, lives }) =>
        pipe([
          tap(() => {
            assert(lives);
            assert(live.ListenerArn);
          }),
          () =>
            lives.getById({
              type: "Listener",
              group: "ELBv2",
              providerName: config.providerName,
              id: live.ListenerArn,
            }),
          tap((listener) => {
            assert(listener);
          }),
          get("live.LoadBalancerArn"),
          tap((LoadBalancerArn) => {
            assert(LoadBalancerArn);
          }),
          (LoadBalancerArn) =>
            lives.getById({
              type: "LoadBalancer",
              group: "ELBv2",
              providerName: config.providerName,
              id: LoadBalancerArn,
            }),
          get("managedByOther"),
        ])(),
    ]),
    tap((params) => {
      assert(true);
    }),
  ]);

  const findDependencies = ({ live }) => [
    { type: "Listener", group: "ELBv2", ids: [live.ListenerArn] },
    {
      type: "TargetGroup",
      group: "ELBv2",
      ids: pipe([() => live, get("Actions"), pluck("TargetGroupArn"), ,])(),
    },
  ];

  const findNamespaceInListener =
    (config) =>
    ({ live, lives }) =>
      pipe([
        () => live,
        get("ListenerArn"),
        (ListenerArn) =>
          lives.getById({
            providerName: config.providerName,
            type: "Listener",
            group: "ELBv2",
            id: ListenerArn,
          }),
        tap((listener) => {
          assert(listener);
        }),
        get("namespace"),
        tap((namespace) => {
          assert(true);
        }),
      ])();

  const findNamespace = ({ live, lives }) =>
    pipe([
      () => findNamespaceInTags(config)({ live }),
      switchCase([
        not(isEmpty),
        identity,
        () => findNamespaceInListener(config)({ live, lives }),
      ]),
      tap((namespace) => {
        logger.debug(`findNamespace rules ${namespace}`);
      }),
    ])();

  const getList = client.getListWithParent({
    parent: { type: "Listener", group: "ELBv2" },
    pickKey: pick(["ListenerArn"]),
    method: "describeRules",
    getParam: "Rules",
    config,
    decorate: ({ lives, parent: { ListenerArn } }) =>
      pipe([
        assign({
          Tags: pipe([
            ({ RuleArn }) => ({ ResourceArns: [RuleArn] }),
            elb().describeTags,
            get("TagDescriptions"),
            first,
            get("Tags"),
          ]),
          ListenerArn: () => ListenerArn,
        }),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeRules-property
  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId: ({ RuleArn }) => ({ RuleArns: [RuleArn] }),
    method: "describeRules",
    getField: "Rules",
    ignoreErrorCodes: ["RuleNotFound"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createRule-property
  const create = client.create({
    method: "createRule",
    getById,
    config,
    pickCreated: () => pipe([get("Rules"), first]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#deleteRule-property
  const destroy = client.destroy({
    pickId,
    method: "deleteRule",
    ignoreErrorCodes: ["RuleNotFound"],
    getById,
  });

  const targetGroupProperties = ({ targetGroup }) =>
    switchCase([
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
      }),
      identity,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createRule-property
  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { listener, targetGroup },
  }) =>
    pipe([
      tap(() => {
        assert(listener);
      }),
      () => ({}),
      defaultsDeep(targetGroupProperties({ targetGroup })),
      defaultsDeep(properties),
      defaultsDeep({
        ListenerArn: getField(listener, "ListenerArn"),
        Tags: buildTags({ name, namespace, config }),
      }),
    ])();

  const cannotBeDeleted = isDefault;

  return {
    spec,
    findId,
    findDependencies,
    findNamespace,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    isDefault,
    cannotBeDeleted,
    managedByOther,
  };
};
