const assert = require("assert");
const { pipe, tap, get, pick, assign, map, switchCase } = require("rubico");
const {
  defaultsDeep,
  isIn,
  when,
  pluck,
  identity,
  isEmpty,
  unless,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");
const { replaceWithName } = require("@grucloud/core/Common");

const toTargetGroupIdentifier = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  ({ id, ...other }) => ({
    targetGroupIdentifier: id,
    ...other,
  }),
]);

const { Tagger, assignTags } = require("./VpcLatticeCommon");

const buildArn = () =>
  pipe([
    get("arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ targetGroupIdentifier }) => {
    assert(targetGroupIdentifier);
  }),
  pick(["targetGroupIdentifier"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toTargetGroupIdentifier,
    assignTags({ buildArn: buildArn(config), endpoint }),
    assign({
      targets: pipe([pickId, endpoint().listTargets, get("items")]),
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html
exports.VpcLatticeTargetGroup = () => ({
  type: "TargetGroup",
  package: "vpc-lattice",
  client: "VPCLattice",
  propertiesDefault: {},
  omitProperties: [
    "arn",
    "targetGroupIdentifier",
    "createdAt",
    "lastUpdatedAt",
    "failureCode",
    "failureMessage",
    "serviceArns",
    "status",
    "config.vpcIdentifier",
    "targets[].reasonCode",
    "targets[].status",
  ],
  inferName: () =>
    pipe([
      get("name"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("targetGroupIdentifier"),
      tap((id) => {
        assert(id);
      }),
    ]),
  filterLive:
    ({ lives, providerConfig }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(live.type);
        }),
        () => live,
        assign({
          targets: pipe([
            get("targets"),
            map(
              pipe([
                switchCase([
                  () => live.type === "LAMBDA",
                  assign({
                    id: pipe([
                      get("id"),
                      replaceWithName({
                        groupType: "Lambda::Function",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  }),
                  () => live.type === "INSTANCE",
                  assign({
                    id: pipe([
                      get("id"),
                      replaceWithName({
                        groupType: "EC2::Instance",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  }),
                  () => live.type === "ALB",
                  assign({
                    id: pipe([
                      get("id"),
                      replaceWithName({
                        groupType: "ElasticLoadBalancingV2::LoadBalancer",
                        path: "id",
                        providerConfig,
                        lives,
                      }),
                    ]),
                  }),
                  identity,
                ]),
              ])
            ),
          ]),
        }),
      ])(),
  ignoreErrorCodes: ["ResourceNotFoundException"],
  dependencies: {
    ec2Instances: {
      type: "Instance",
      group: "EC2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("targets"), pluck("id")]),
    },
    lambdaFunctions: {
      type: "Function",
      group: "Lambda",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("targets"), pluck("id")]),
    },
    elbLoadBalancers: {
      type: "LoadBalancer",
      group: "ElasticLoadBalancingV2",
      list: true,
      dependencyIds: ({ lives, config }) => pipe([get("targets"), pluck("id")]),
    },
    vpc: {
      type: "Vpc",
      group: "EC2",
      dependencyId: ({ lives, config }) => get("config.vpcIdentifier"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#getTargetGroup-property
  getById: {
    method: "getTargetGroup",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#listTargetGroups-property
  getList: {
    method: "listTargetGroups",
    getParam: "items",
    decorate: ({ getById }) => pipe([toTargetGroupIdentifier, getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#createTargetGroup-property
  create: {
    method: "createTargetGroup",
    pickCreated: ({ payload }) => pipe([toTargetGroupIdentifier]),
    isInstanceUp: pipe([get("status"), isIn(["ACTIVE"])]),
    isInstanceError: pipe([get("status"), isIn(["CREATE_FAILED"])]),
    getErrorMessage: pipe([get("failureMessage", "CREATE_FAILED")]),
    postCreate:
      ({ endpoint, payload }) =>
      (live) =>
        pipe([
          () => payload,
          pick(["targets"]),
          defaultsDeep({ targetGroupIdentifier: live.targetGroupIdentifier }),
          endpoint().registerTargets,
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#updateTargetGroup-property
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        // registerTargets
        () => payload,
        pick(["targets"]),
        defaultsDeep({ targetGroupIdentifier: live.targetGroupIdentifier }),
        endpoint().registerTargets,
        //
        () => payload,
        get("config"),
        defaultsDeep({ targetGroupIdentifier: live.targetGroupIdentifier }),
        endpoint().updateTargetGroup,
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/VPCLattice.html#deleteTargetGroup-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap(
        pipe([
          tap((params) => {
            assert(true);
          }),
          pick(["targetGroupIdentifier", "targets"]),
          unless(pipe([get("targets"), isEmpty]), endpoint().deregisterTargets),
        ])
      ),
    method: "deleteTargetGroup",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { vpc },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
      when(
        () => vpc,
        defaultsDeep({
          config: { vpcIdentifier: getField(vpc, "VpcId") },
        })
      ),
    ])(),
});
