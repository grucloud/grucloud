const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  not,
} = require("rubico");
const {
  find,
  defaultsDeep,
  pluck,
  isEmpty,
  first,
  includes,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AutoScalingGroup" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  AutoScalingNew,
  shouldRetryOnException,
  findValueInTags,
  findNamespaceInTagsOrEksCluster,
} = require("../AwsCommon");
const { isOurMinionObject } = require("@grucloud/core/Common");

const findName = get("AutoScalingGroupName");
const findId = get("AutoScalingGroupName");

const findClusterName = findValueInTags({ key: "eks:cluster-name" });

const findClusterNameFromLives = ({ clusterName, clusters }) =>
  pipe([
    tap(() => {
      logger.debug(`findClusterNameFromLives ${clusterName}`);
      //assert(clusterName);
      //assert(clusters);
    }),
    () => clusters,
    get("resources"),
    find(eq(get("name"), clusterName)),
    tap((resource) => {
      assert(true);
    }),
    get("live"),
  ])();

exports.autoScalingGroupIsOurMinion = ({ live, lives, config }) =>
  pipe([
    tap(() => {
      assert(live);
      assert(lives);
      assert(config.providerName);
      logger.debug(`autoScalingGroupIsOurMinion`);
    }),
    () => findClusterName(live),
    (clusterName) =>
      findClusterNameFromLives({
        clusterName,
        clusters: lives.getByType({
          providerName: config.providerName,
          type: "EKSCluster",
        }),
      }),
    tap((clusterLive) => {
      logger.debug(`autoScalingGroupIsOurMinion clusterLive: ${clusterLive}`);
    }),
    get("tags"),
    (tags) => isOurMinionObject({ tags, config }),
    tap((result) => {
      logger.debug(`autoScalingGroupIsOurMinion result: ${result}`);
    }),
  ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html
exports.AwsAutoScalingGroup = ({ spec, config }) => {
  const autoScaling = AutoScalingNew(config);

  const findDependencies = ({ live }) => [
    { type: "TargetGroup", ids: live.TargetGroupARNs },
    {
      type: "EC2",
      ids: pipe([() => live, get("Instances"), pluck("InstanceId")])(),
    },
  ];

  const findNamespace = findNamespaceInTagsOrEksCluster({
    config,
    key: "eks:cluster-name",
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeAutoScalingGroups-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList autoscaling group ${tos(params)}`);
      }),
      () => autoScaling().describeAutoScalingGroups({}),
      get("AutoScalingGroups"),
      (items = []) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList autoscaling group ${total}`);
      }),
    ])();

  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${tos(name)}`);
      }),
      () =>
        autoScaling().describeAutoScalingGroups({
          AutoScalingGroupNames: [name],
        }),
      get("AutoScalingGroups"),
      first,
      tap((result) => {
        logger.debug(`getByName: ${name}, result: ${tos(result)}`);
      }),
    ])();

  const isDownByName = ({ name }) =>
    pipe([() => getByName({ name }), isEmpty])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteAutoScalingGroup-property
  const destroy = async ({ live }) =>
    pipe([
      () => ({ name: findName(live) }),
      ({ name }) =>
        pipe([
          tap(() => {
            logger.info(
              `destroy autoscaling group ${JSON.stringify({ name })}`
            );
          }),
          tryCatch(
            pipe([
              //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#updateAutoScalingGroup-property
              () => ({ AutoScalingGroupName: name, ForceDelete: true }),
              (params) => autoScaling().deleteAutoScalingGroup(params),
              tap(() =>
                retryCall({
                  name: `isDownByName: ${name}`,
                  fn: () => isDownByName({ name }),
                  config,
                })
              ),
            ]),
            tap.if(
              pipe([
                get("message"),
                not(includes("AutoScalingGroup name not found")),
              ]),
              (error) => {
                throw error;
              }
            )
          ),

          tap(() => {
            logger.info(
              `destroyed autoscaling group ${JSON.stringify({ name })}`
            );
          }),
        ])(),
    ])();

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({})(properties);

  return {
    type: "AutoScalingGroup",
    spec,
    findId,
    findDependencies,
    findNamespace,
    findName,
    getByName,
    findName,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
