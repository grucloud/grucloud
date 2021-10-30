const assert = require("assert");
const { tap, get, pipe, map, not, fork, flatMap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "AutoScalingAttachment",
});
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const {
  Ec2New,
  shouldRetryOnException,
  createEndpoint,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
//const { AwsClient } = require("../AwsClient");

exports.AutoScalingAttachment = ({ spec, config }) => {
  const autoScaling = () =>
    createEndpoint({ endpointName: "AutoScaling" })(config);

  //const client = AwsClient({ spec, config });
  const ec2 = Ec2New(config);

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
      (targetGroupName) =>
        `attachment::${live.AutoScalingGroupName}::${targetGroupName}`,
      tap((params) => {
        assert(true);
      }),
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
      flatMap(({ live }) =>
        pipe([
          () => live,
          get("TargetGroupARNs"),
          map((TargetGroupARN) => ({
            TargetGroupARN,
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
      tap(() => dependencies().autoScalingGroup.getLive({ lives })),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#detachLoadBalancerTargetGroups-property
  const destroy = ({ name, live }) =>
    pipe([
      tap(() => {
        logger.info(
          `detachLoadBalancerTargetGroups ${JSON.stringify({ live })}`
        );
      }),
      () => live,
      ({ TargetGroupARN, AutoScalingGroupName }) => ({
        AutoScalingGroupName,
        TargetGroupARNs: [TargetGroupARN],
      }),
      autoScaling().detachLoadBalancerTargetGroups,
      tap((result) => {
        logger.info(`detached ${JSON.stringify({ name, result })}`);
      }),
    ])();

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
    shouldRetryOnException,
  };
};
