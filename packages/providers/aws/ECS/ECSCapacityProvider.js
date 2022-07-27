const assert = require("assert");
const { pipe, tap, get, switchCase, eq, pick, omit } = require("rubico");
const { defaultsDeep, isEmpty, includes } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { destroyAutoScalingGroupById } = require("../AwsCommon");
const {
  AutoScalingAutoScalingGroup,
} = require("../Autoscaling/AutoScalingAutoScalingGroup");
const { AwsClient } = require("../AwsClient");
const {
  createECS,
  buildTagsEcs,
  tagResource,
  untagResource,
} = require("./ECSCommon");
const findId = get("live.capacityProviderArn");
const findName = get("live.name");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html
exports.ECSCapacityProvider = ({ spec, config }) => {
  const ecs = createECS(config);
  const client = AwsClient({ spec, config })(ecs);
  const autoScalingGroup = AutoScalingAutoScalingGroup({
    spec: { type: "AutoScalingGroup", group: "AutoScaling" },
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeCapacityProviders-property
  const getById = client.getById({
    pickId: ({ name }) => ({ capacityProviders: [name] }),
    extraParams: { include: ["TAGS"] },
    method: "describeCapacityProviders",
    getField: "capacityProviders",
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#describeCapacityProviders-property
  const getList = client.getList({
    extraParam: { include: ["TAGS"] },
    method: "describeCapacityProviders",
    getParam: "capacityProviders",
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#createCapacityProvider-property
  const configDefault = ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { autoScalingGroup },
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        name,
        ...(autoScalingGroup && {
          autoScalingGroupProvider: {
            autoScalingGroupArn: getField(
              autoScalingGroup,
              "AutoScalingGroupARN"
            ),
          },
        }),
        tags: buildTagsEcs({
          name,
          config,
          namespace,
          tags,
        }),
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

  const create = client.create({
    method: "createCapacityProvider",
    pickCreated:
      ({ name }) =>
      () => ({ name }),
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#updateCapacityProvider-property
  const update = client.update({
    pickId: pick(["name", "autoScalingGroupProvider"]),
    filterParams: ({ payload, diff }) =>
      pipe([
        () => payload,
        omit(["autoScalingGroupProvider.autoScalingGroupArn", "tags"]),
      ])(),
    method: "updateCapacityProvider",
    getById,
  });

  const deleteAutoScalingGroup = ({ live, lives }) =>
    pipe([
      () => live,
      get("autoScalingGroupProvider.autoScalingGroupArn"),
      destroyAutoScalingGroupById({ autoScalingGroup, lives, config }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#deleteCapacityProvider-property
  const destroy = client.destroy({
    pickId: ({ name }) => ({ capacityProvider: name }),
    preDestroy: deleteAutoScalingGroup,
    method: "deleteCapacityProvider",
    isInstanceDown: switchCase([
      eq(get("updateStatus"), "DELETE_FAILED"),
      () => {
        throw Error(`DELETE_FAILED`);
      },
      eq(get("updateStatus"), "DELETE_COMPLETE"),
      () => true,
      isEmpty,
      () => true,
      () => false,
    ]),
    getById,
    ignoreErrorMessages: [
      "The specified capacity provider does not exist. Specify a valid name or ARN and try again.",
    ],
  });

  const cannotBeDeleted = ({ live }) =>
    pipe([() => ["FARGATE", "FARGATE_SPOT"], includes(live.name)])();

  return {
    spec,
    findId,
    getByName: getById,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    cannotBeDeleted,
    managedByOther: cannotBeDeleted,
    isDefault: cannotBeDeleted,
    tagResource: tagResource({ ecs }),
    untagResource: untagResource({ ecs }),
  };
};
