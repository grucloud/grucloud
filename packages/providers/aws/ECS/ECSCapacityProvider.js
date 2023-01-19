const assert = require("assert");
const { pipe, tap, get, eq, pick, omit } = require("rubico");
const { defaultsDeep, when, isIn } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  Tagger,
  buildTagsEcs,
  destroyAutoScalingGroupById,
} = require("./ECSCommon");

const buildArn = () =>
  pipe([
    get("capacityProviderArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const findId = () =>
  pipe([
    get("capacityProviderArn"),
    tap((id) => {
      assert(id);
    }),
  ]);

const findName = () =>
  pipe([
    get("name"),
    tap((name) => {
      assert(name);
    }),
  ]);

const cannotBeDeleted = () =>
  pipe([get("name"), isIn(["FARGATE", "FARGATE_SPOT"])]);

const deleteAutoScalingGroup = ({ lives, config }) =>
  tap(
    pipe([
      tap((params) => {
        assert(lives);
        assert(config);
      }),
      get("autoScalingGroupProvider.autoScalingGroupArn"),
      destroyAutoScalingGroupById({ lives, config }),
    ])
  );

exports.ECSCapacityProvider = ({ compare }) => ({
  type: "CapacityProvider",
  package: "ecs",
  client: "ECS",
  inferName: findName,
  findName,
  findId,
  ignoreErrorCodes: ["ClusterNotFoundException", "InvalidParameterException"],
  omitProperties: [
    "capacityProviderArn",
    "status",
    "updateStatus",
    "autoScalingGroupProvider.autoScalingGroupArn",
  ],
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  isDefault: cannotBeDeleted,
  compare: compare({}),
  filterLive: () =>
    pipe([
      pick(["name", "autoScalingGroupProvider"]),
      omit(["autoScalingGroupProvider.autoScalingGroupArn"]),
    ]),
  dependencies: {
    autoScalingGroup: {
      type: "AutoScalingGroup",
      group: "AutoScaling",
      dependencyId: ({ lives, config }) =>
        get("autoScalingGroupProvider.autoScalingGroupArn"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeCapacityProviders-property
  getById: {
    pickId: ({ name }) => ({ capacityProviders: [name], include: ["TAGS"] }),
    method: "describeCapacityProviders",
    getField: "capacityProviders",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeCapacityProviders-property
  getList: {
    enhanceParams: () => () => ({ include: ["TAGS"] }),
    method: "describeCapacityProviders",
    getParam: "capacityProviders",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createCapacityProvider-property
  create: {
    method: "createCapacityProvider",
    pickCreated:
      ({ name }) =>
      () => ({ name }),
    isInstanceUp: eq(get("status"), "ACTIVE"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#updateCapacityProvider-property
  update: {
    pickId: pick(["name", "autoScalingGroupProvider"]),
    filterParams: ({ payload, diff }) =>
      pipe([
        () => payload,
        omit(["autoScalingGroupProvider.autoScalingGroupArn", "tags"]),
      ])(),
    method: "updateCapacityProvider",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteCapacityProvider-property
  destroy: {
    pickId: ({ name }) => ({ capacityProvider: name }),
    preDestroy: deleteAutoScalingGroup,
    method: "deleteCapacityProvider",
    isInstanceDown: eq(get("updateStatus"), "DELETE_COMPLETE"),
    isInstanceError: eq(get("updateStatus"), "DELETE_FAILED"),
    getErrorMessage: get("updateStatusReason", "error"),
    ignoreErrorMessages: [
      "The specified capacity provider does not exist. Specify a valid name or ARN and try again.",
    ],
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ name: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { autoScalingGroup },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        name,
        tags: buildTagsEcs({
          name,
          config,
          namespace,
          tags,
        }),
      }),
      when(
        () => autoScalingGroup,
        defaultsDeep({
          autoScalingGroupProvider: {
            autoScalingGroupArn: getField(
              autoScalingGroup,
              "AutoScalingGroupARN"
            ),
          },
        })
      ),
    ])(),
});
