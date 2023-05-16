const assert = require("assert");
const { tap, get, pipe, map, pick } = require("rubico");
const { defaultsDeep, first, find, unless, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
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
      (targetGroupName) =>
        `attachment::${live.AutoScalingGroupName}::${targetGroupName}`,
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
  inferName:
    ({ dependenciesSpec: { autoScalingGroup, targetGroup } }) =>
    () =>
      pipe([
        tap(() => {
          assert(autoScalingGroup);
          assert(targetGroup);
        }),
        () => `attachment::${autoScalingGroup}::${targetGroup}`,
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
    filterPayload,
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
        tap(() => {
          assert(live.TargetGroupARN);
          assert(live.AutoScalingGroupName);
        }),
        get("AutoScalingGroups"),
        first,
        find(eq(get("TargetGroupARNs"), live.TargetGroupARN)),
        unless(isEmpty, () => ({
          AutoScalingGroupName: live.AutoScalingGroupName,
          TargetGroupARN: live.TargetGroupARN,
        })),
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
    method: "attachLoadBalancerTargetGroups",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#updateAutoScalingAttachment-property
  // update: {
  //   method: "updateAutoScalingAttachment",
  //   filterParams: ({ payload, diff, live }) =>
  //     pipe([() => payload, defaultsDeep(pickId(live))])(),
  // },
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
  getByName: getByNameCore,
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
