const assert = require("assert");
const { map, pipe, tap, tryCatch, get, switchCase, eq } = require("rubico");
const { find, defaultsDeep, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AutoScalingGroup" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { AutoScalingNew, shouldRetryOnException } = require("../AwsCommon");
const { isOurMinionObject } = require("@grucloud/core/Common");

const findName = get("AutoScalingGroupName");
const findId = get("AutoScalingGroupName");

const findClusterNameFromLive = pipe([
  get("Tags"),
  find(eq(get("Key"), "eks:cluster-name")),
  get("Value"),
]);

const findClusterNameFromLives = ({ clusterName, clusters }) =>
  pipe([
    tap(() => {
      logger.debug(`findClusterNameFromLives ${clusterName}`);
      assert(clusterName);
      assert(clusters);
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
    () => findClusterNameFromLive(live),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#describeAutoScalingGroups-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ${tos(params)}`);
      }),
      () => autoScaling().describeAutoScalingGroups({}),
      get("AutoScalingGroups"),
      (items = []) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: ${total}`);
      }),
    ])();

  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${tos(params)}`);
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

  const getById = ({ id }) => getByName({ name: id });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#deleteAutoScalingGroup-property
  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId(live), name: findName(live) }),
      ({ id, name }) =>
        pipe([
          tap(() => {
            logger.info(`destroy ${JSON.stringify({ name, id })}`);
          }),

          //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AutoScaling.html#updateAutoScalingGroup-property
          () => ({ AutoScalingGroupName: name, ForceDelete: true }),
          (params) => autoScaling().deleteAutoScalingGroup(params),
          tap(() =>
            retryCall({
              name: `isDownById: ${id}`,
              fn: () => isDownById({ id }),
              config,
            })
          ),
          tap(() => {
            logger.info(`destroyed ${JSON.stringify({ name, id })}`);
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
    findName,
    getByName,
    findName,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
