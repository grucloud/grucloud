const assert = require("assert");
const { tap, get, pipe, map, not, fork, flatMap } = require("rubico");
const { defaultsDeep, first, includes, size } = require("rubico/x");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "AutoScalingAttachment",
});
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const { createEndpoint } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

exports.AutoScalingAttachment = ({ spec, config }) => {
  const autoScaling = () =>
    createEndpoint({ endpointName: "AutoScaling" })(config);

  const client = AwsClient({ spec, config });
  const findId = get("live.TargetGroupARN");

  const findName = ({ live, lives }) =>
    pipe([
      () =>
        lives.getById({
          id: live.TargetGroupARN,
          providerName: config.providerName,
          type: "TargetGroup",
          group: "ELBv2",
        }),
      get("name"),
      tap((targetGroupName) => {
        assert(targetGroupName);
      }),
      (targetGroupName) => `attachment::${live.name}::${targetGroupName}`,
    ])();

  const findDependencies = ({ live }) => [
    { type: "TargetGroup", group: "ELBv2", ids: [live.TargetGroupARN] },
    {
      type: "AutoScalingGroup",
      group: "AutoScaling",
      ids: [live.AutoScalingGroupARN],
    },
  ];

  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        logger.info(`getList autoscaling attachment`);
      }),
      () =>
        lives.getByType({
          type: "AutoScalingGroup",
          group: "AutoScaling",
          providerName: config.providerName,
        }),
      tap((asg) => {
        logger.info(`getList attachment #autoscalinggroups ${size(asg)}`);
      }),
      flatMap(({ live, name }) =>
        pipe([
          () => live,
          get("TargetGroupARNs"),
          map((TargetGroupARN) => ({
            TargetGroupARN,
            name,
            AutoScalingGroupName: live.AutoScalingGroupName,
            AutoScalingGroupARN: live.AutoScalingGroupARN,
          })),
        ])()
      ),
      tap((params) => {
        assert(true);
      }),
    ])();

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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#detachLoadBalancerTargetGroups-property
  const destroy = client.destroy({
    pickId: ({ TargetGroupARN, AutoScalingGroupName }) => ({
      AutoScalingGroupName,
      TargetGroupARNs: [TargetGroupARN],
    }),
    method: "detachLoadBalancerTargetGroups",
    config,
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
    findName,
    findDependencies,
    getByName,
    //getById,
    getList,
    create,
    destroy,
    configDefault,
  };
};
