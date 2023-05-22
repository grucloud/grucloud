const assert = require("assert");
const { tap, get, pipe, map, pick, switchCase, fork } = require("rubico");
const { defaultsDeep, first, includes, callProp } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const { compare } = require("./AutoScalingCommon");

const ignoreErrorMessages = ["not found"];

const findId = () =>
  pipe([
    get("TargetGroupARN"),
    tap((TargetGroupARN) => {
      assert(TargetGroupARN);
    }),
  ]);

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap(() => {
        assert(live.AutoScalingGroupName);
        assert(live.TargetGroupARN);
      }),
      () => live,
      get("TargetGroupARN"),
      lives.getById({
        providerName: config.providerName,
        type: "TargetGroup",
        group: "ElasticLoadBalancingV2",
      }),
      get("name", live.TargetGroupARN),
      (targetGroupName) => `${live.AutoScalingGroupName}::${targetGroupName}`,
    ])();

const managedByOther =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(config);
        assert(live);
        assert(live.TargetGroupARN);
      }),
      () => live,
      get("TargetGroupARN"),
      lives.getById({
        providerName: config.providerName,
        type: "TargetGroup",
        group: "ElasticLoadBalancingV2",
      }),
      get("managedByOther"),
    ])();

const filterPayload = pipe([
  tap(({ TargetGroupARN }) => {
    assert(TargetGroupARN);
  }),
  ({ TargetGroupARN, ...other }) => ({
    TargetGroupARNs: [TargetGroupARN],
    ...other,
  }),
]);

exports.AutoScalingAttachment = ({}) => ({
  type: "AutoScalingAttachment",
  package: "auto-scaling",
  client: "AutoScaling",
  propertiesDefault: {},
  omitProperties: [],
  inferName:
    ({ dependenciesSpec: { autoScalingGroup, targetGroup } }) =>
    () =>
      pipe([
        tap(() => {
          assert(autoScalingGroup);
          assert(targetGroup);
        }),
        () => `${autoScalingGroup}::${targetGroup}`,
      ])(),
  findName,
  findId,
  compare: compare({
    filterTarget: () => pipe([pick([])]),
    filterLive: () => pipe([pick([])]),
  }),
  filterLive: () => pipe([pick([])]),
  managedByOther,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    autoScalingGroup: {
      type: "AutoScalingGroup",
      group: "AutoScaling",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("AutoScalingGroupARN"),
          tap((AutoScalingGroupARN) => {
            assert(AutoScalingGroupARN);
          }),
        ]),
    },
    targetGroup: {
      type: "TargetGroup",
      group: "ElasticLoadBalancingV2",
      required: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("TargetGroupARN"),
          tap((TargetGroupARN) => {
            assert(TargetGroupARN);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeAutoScalingGroups-property
  getById: {
    method: "describeAutoScalingGroups",
    pickId: pipe([
      tap(({ AutoScalingGroupName }) => {
        assert(AutoScalingGroupName);
      }),
      ({ AutoScalingGroupName }) => ({
        AutoScalingGroupNames: [AutoScalingGroupName],
      }),
    ]),
    decorate: ({ live }) =>
      pipe([
        tap((params) => {
          assert(live.TargetGroupARN);
          assert(live.AutoScalingGroupName);
        }),
        get("AutoScalingGroups"),
        first,
        get("TargetGroupARNs"),
        switchCase([
          includes(live.TargetGroupARN),
          () => ({
            AutoScalingGroupName: live.AutoScalingGroupName,
            TargetGroupARN: live.TargetGroupARN,
          }),
          () => undefined,
        ]),
        tap((params) => {
          assert(true);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeAutoScalingGroups-property
  getList: ({ client, config }) =>
    client.getListWithParent({
      parent: { type: "AutoScalingGroup", group: "AutoScaling" },
      config,
      decorate: ({
        name,
        parent: {
          TargetGroupARNs = [],
          AutoScalingGroupName,
          AutoScalingGroupARN,
        },
      }) =>
        pipe([
          () => TargetGroupARNs,
          map((TargetGroupARN) => ({
            TargetGroupARN,
            name,
            AutoScalingGroupName,
            AutoScalingGroupARN,
          })),
        ]),
    }),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#attachLoadBalancerTargetGroups-property
  create: {
    filterPayload,
    method: "attachLoadBalancerTargetGroups",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#detachLoadBalancerTargetGroups-property
  destroy: {
    pickId: pipe([
      tap(({ TargetGroupARN, AutoScalingGroupName }) => {
        assert(TargetGroupARN);
        assert(AutoScalingGroupName);
      }),
      ({ TargetGroupARN, AutoScalingGroupName }) => ({
        AutoScalingGroupName,
        TargetGroupARNs: [TargetGroupARN],
      }),
    ]),
    method: "detachLoadBalancerTargetGroups",
    ignoreErrorMessages,
  },
  getByName: ({ getById }) =>
    pipe([
      get("resolvedDependencies"),
      fork({
        AutoScalingGroupName: pipe([
          get("autoScalingGroup.live.AutoScalingGroupName"),
        ]),
        TargetGroupARN: pipe([get("targetGroup.live.TargetGroupArn")]),
      }),
      getById({}),
    ]),
  configDefault: ({
    name,
    namespace,
    properties = {},
    dependencies: { targetGroup, autoScalingGroup },
  }) =>
    pipe([
      tap(() => {
        assert(
          targetGroup,
          "AutoScalingAttachment is missing the dependency 'targetGroup'"
        );
        assert(
          autoScalingGroup,
          "AutoScalingAttachment is missing the dependency 'autoScalingGroup'"
        );
      }),
      () => properties,
      defaultsDeep({
        TargetGroupARN: getField(targetGroup, "TargetGroupArn"),
        AutoScalingGroupName: getField(
          autoScalingGroup,
          "AutoScalingGroupName"
        ),
      }),
    ])(),
});
