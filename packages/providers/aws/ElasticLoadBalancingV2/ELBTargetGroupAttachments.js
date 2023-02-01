const assert = require("assert");
const { pipe, tap, get, pick, map, assign, omit, eq } = require("rubico");
const { defaultsDeep, when, pluck, isEmpty } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceArnWithAccountAndRegion } = require("../AwsCommon");

const isInstanceDown = pipe([get("Targets"), isEmpty]);

const cannotBeDeleted = () => pipe([isInstanceDown]);

const pickId = pipe([
  tap(({ TargetGroupArn, Targets }) => {
    assert(TargetGroupArn);
    assert(Targets);
  }),
  pick(["TargetGroupArn", "Targets"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live.TargetGroupArn);
    }),
    get("TargetHealthDescriptions"),
    pluck("Target"),
    tap((params) => {
      assert(true);
    }),
    (Targets) => ({
      TargetGroupArn: live.TargetGroupArn,
      Targets,
    }),
    assign({
      Targets: pipe([
        get("Targets"),
        map(
          when(eq(get("AvailabilityZone"), "all"), omit(["AvailabilityZone"]))
        ),
      ]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html
exports.ElasticLoadBalancingV2TargetGroupAttachments = () => ({
  type: "TargetGroupAttachments",
  package: "elastic-load-balancing-v2",
  client: "ElasticLoadBalancingV2",
  propertiesDefault: {},
  omitProperties: ["TargetGroupArn"],
  inferName: ({ dependenciesSpec: { elbTargetGroup } }) =>
    pipe([
      () => elbTargetGroup,
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: ({ lives, config }) =>
    pipe([
      get("TargetGroupArn"),
      lives.getById({
        type: "TargetGroup",
        group: "ElasticLoadBalancingV2",
        providerName: config.providerName,
      }),
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("TargetGroupArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  ignoreErrorCodes: [
    "TargetGroupNotFoundException",
    "ResourceNotFoundException",
  ],
  dependencies: {
    elbTargetGroup: {
      type: "TargetGroup",
      group: "ElasticLoadBalancingV2",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("TargetGroupArn"),
          tap((TargetGroupArn) => {
            assert(TargetGroupArn);
          }),
        ]),
    },
    lambdaFunctions: {
      type: "Function",
      group: "Lambda",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("Targets"), pluck("Id")]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Targets: pipe([
          get("Targets"),
          map(
            when(
              get("Id"),
              assign({
                Id: pipe([
                  get("Id"),
                  replaceArnWithAccountAndRegion({
                    providerConfig,
                    lives,
                  }),
                ]),
              })
            )
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#getPolicy-property
  getById: {
    method: "describeTargetHealth",
    pickId: pipe([
      tap(({ TargetGroupArn }) => {
        assert(TargetGroupArn);
      }),
      pick(["TargetGroupArn"]),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#getPolicy-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "TargetGroup", group: "ElasticLoadBalancingV2" },
          pickKey: pipe([
            tap(({ TargetGroupArn }) => {
              assert(TargetGroupArn);
            }),
            pick(["TargetGroupArn"]),
          ]),
          method: "describeTargetHealth",
          config,
          decorate: ({ endpoint, parent }) =>
            pipe([decorate({ endpoint, config, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#registerTargets-property
  create: {
    method: "registerTargets",
    pickCreated: ({ payload }) => pipe([() => payload]),
    shouldRetryOnExceptionMessages: [
      "elasticloadbalancing principal does not have permission",
    ],
  },
  update: {
    method: "registerTargets",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#deregisterTargets-property
  destroy: {
    method: "deregisterTargets",
    pickId,
    isInstanceDown: pipe([get("Targets"), isEmpty]),
  },
  getByName:
    ({ getList, endpoint }) =>
    ({ name, resolvedDependencies: { elbTargetGroup } }) =>
      pipe([
        tap((params) => {
          assert(elbTargetGroup);
        }),
        () => elbTargetGroup,
        get("live"),
        pick(["TargetGroupArn"]),
        endpoint().describeTargetHealth,
        decorate({ endpoint, live: elbTargetGroup.live }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { elbTargetGroup },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(elbTargetGroup);
      }),
      () => otherProps,
      defaultsDeep({
        TargetGroupArn: getField(elbTargetGroup, "TargetGroupArn"),
      }),
    ])(),
});
