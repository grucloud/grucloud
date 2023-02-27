const assert = require("assert");
const { tap, get, pipe, map } = require("rubico");
const { defaultsDeep, first, includes } = require("rubico/x");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "AutoScalingAttachment",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { createAutoScaling } = require("./AutoScalingCommon");

const ignoreErrorMessages = ["not found"];

const findId = () => get("TargetGroupARN");

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      get("TargetGroupARN"),
      lives.getById({
        providerName: config.providerName,
        type: "TargetGroup",
        group: "ElasticLoadBalancingV2",
      }),
      get("name", live.TargetGroupARN),
      tap((targetGroupName) => {
        assert(targetGroupName);
      }),
      (targetGroupName) => `attachment::${live.name}::${targetGroupName}`,
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

exports.AutoScalingAttachment = ({ spec, config }) => {
  const autoScaling = createAutoScaling(config);

  const client = AwsClient({ spec, config })(autoScaling);

  const getList = client.getListWithParent({
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
  });

  const getByName = getByNameCore({ getList, findName });
  //TODO
  // const getById = client.getById({
  //   pickId: ({ AutoScalingGroupName }) => ({
  //     AutoScalingGroupNames: [AutoScalingGroupName],
  //   }),
  //   method: "describeAutoScalingGroups",
  //   getField: "AutoScalingGroups",
  //   decorate: () => pipe([get("TargetGroupARNs"), includes(TargetGroupARN)]),
  // });

  const isUpById = ({ TargetGroupARN, AutoScalingGroupName }) =>
    pipe([
      tap(() => {
        logger.debug(
          `isUpById ${JSON.stringify({ AutoScalingGroupName, TargetGroupARN })}`
        );
        assert(TargetGroupARN);
        assert(AutoScalingGroupName);
      }),
      () => ({ AutoScalingGroupNames: [AutoScalingGroupName] }),
      autoScaling().describeAutoScalingGroups,
      get("AutoScalingGroups"),
      first,
      get("TargetGroupARNs"),
      includes(TargetGroupARN),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#attachLoadBalancerTargetGroups-property
  //TODO create
  const create = ({ payload, name, dependencies, lives }) =>
    pipe([
      tap(() => {
        logger.info(`attachLoadBalancerTargetGroups ${tos({ payload })}`);
      }),
      () => payload,
      autoScaling().attachLoadBalancerTargetGroups,
      tap((result) => {
        logger.debug(`attached ${JSON.stringify({ payload, result })}`);
      }),
      tap(() =>
        retryCall({
          name: `isUpById AutoScalingAttachment: ${name}`,
          fn: pipe([
            () => ({
              AutoScalingGroupName: payload.AutoScalingGroupName,
              TargetGroupARN: payload.TargetGroupARNs[0],
            }),
            isUpById,
          ]),
          config,
        })
      ),
      tap(() => dependencies().autoScalingGroup.getLive({ lives })),
    ])();

  //TODO ignoreErrorCodes
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#detachLoadBalancerTargetGroups-property
  const destroy = client.destroy({
    pickId: ({ TargetGroupARN, AutoScalingGroupName }) => ({
      AutoScalingGroupName,
      TargetGroupARNs: [TargetGroupARN],
    }),
    method: "detachLoadBalancerTargetGroups",
    config,
    ignoreErrorMessages,
  });

  const configDefault = ({
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
        TargetGroupARNs: [getField(targetGroup, "TargetGroupArn")],
        AutoScalingGroupName: getField(
          autoScalingGroup,
          "AutoScalingGroupName"
        ),
      }),
    ])();

  return {
    spec,
    findId,
    managedByOther,
    findName,
    getByName,
    getList,
    create,
    destroy,
    configDefault,
  };
};
