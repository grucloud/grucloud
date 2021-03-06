const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  not,
  and,
  assign,
  eq,
  switchCase,
  tryCatch,
} = require("rubico");
const { first, find, defaultsDeep, isEmpty, identity } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

const logger = require("@grucloud/core/logger")({ prefix: "ELBTargetGroup" });

const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { isUpByIdCore, isDownByIdCore } = require("@grucloud/core/Common");
const {
  ELBv2New,
  AutoScalingNew,
  buildTags,
  findNamespaceInTagsOrEksCluster,
  shouldRetryOnException,
} = require("../AwsCommon");

const findName = get("live.TargetGroupName");
const findId = get("live.TargetGroupArn");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html

exports.ELBTargetGroup = ({ spec, config }) => {
  const elb = ELBv2New(config);
  const autoScaling = AutoScalingNew(config);

  // TODO findDependencies
  const findDependencies = ({ live }) => [
    { type: "Vpc", ids: [live.VpcId] },
    { type: "LoadBalancer", ids: live.LoadBalancerArns },
  ];

  const findNamespace = findNamespaceInTagsOrEksCluster({
    config,
    key: "elbv2.k8s.aws/cluster",
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeTargetGroups-property
  const getList = async () =>
    pipe([
      tap(() => {
        logger.info(`getList target group`);
      }),
      () => elb().describeTargetGroups({}),
      get("TargetGroups"),
      map(
        assign({
          Tags: pipe([
            ({ TargetGroupArn }) =>
              elb().describeTags({ ResourceArns: [TargetGroupArn] }),
            get("TagDescriptions"),
            first,
            get("Tags"),
          ]),
        })
      ),
      tap((results) => {
        logger.debug(`getList target group result: ${tos(results)}`);
      }),
      (items = []) => ({
        total: items.length,
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: target group #total: ${total}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeTargetGroups-property
  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      () => elb().describeTargetGroups({}),
      get("TargetGroups"),
      find(eq((live) => findName({ live }), name)),
      tap((result) => {
        logger.debug(`getByName ${name}, result: ${tos(result)}`);
      }),
    ])();

  const getById = ({ id }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.info(`getById ${id}`);
        }),
        () => ({ TargetGroupArns: [id] }),
        (params) => elb().describeTargetGroups(params),
        get("TargetGroups"),
        first,
        tap((result) => {
          logger.debug(`getById ${id}, result: ${tos(result)}`);
        }),
      ]),
      switchCase([
        eq(get("code"), "TargetGroupNotFound"),
        () => false,
        (error) => {
          logger.error(`getById ${id}, error: ${tos(error)}`);
          throw error;
        },
      ])
    )();

  const isInstanceUp = not(isEmpty);

  const isUpById = isUpByIdCore({ isInstanceUp, getById });
  const isDownById = isDownByIdCore({ getById });

  const findAutoScalingGroup = ({ nodeGroup }) =>
    pipe([
      tap(() => {
        logger.info(`findAutoScalingGroup: ${nodeGroup.name}`);
        assert(nodeGroup);
      }),
      () => autoScaling().describeAutoScalingGroups({}),
      get("AutoScalingGroups"),
      tap((autoScalingGroups) => {
        logger.debug(`findAutoScalingGroup: #asg: ${autoScalingGroups.length}`);
        logger.debug(
          `findAutoScalingGroup: asg: ${JSON.stringify(
            autoScalingGroups,
            null,
            4
          )}`
        );
      }),
      find(
        pipe([
          get("Tags"),
          find(
            and([
              eq(get("Key"), "eks:nodegroup-name"),
              eq(get("Value"), nodeGroup.name),
            ])
          ),
        ])
      ),
      tap.if(isEmpty, () => {
        throw Error(
          `Cannot find AutoScalingGroup for nodeGroup: ${nodeGroup.name}`
        );
      }),
      tap((autoScalingGroup) => {
        assert(autoScalingGroup.AutoScalingGroupName);
        logger.info(`findAutoScalingGroup : ${tos(autoScalingGroup)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createTargetGroup-property
  const create = async ({
    name,
    payload,
    dependencies: { nodeGroup, autoScalingGroup },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create target group : ${name}`);
        logger.debug(`${tos(payload)}`);
      }),
      () => elb().createTargetGroup(payload),
      get("TargetGroups"),
      first,
      tap(({ TargetGroupArn }) =>
        retryCall({
          name: `target group isUpById: ${name}, TargetGroupArn: ${TargetGroupArn}`,
          fn: () => isUpById({ name, id: TargetGroupArn }),
          config,
        })
      ),
      switchCase([
        // NodeGroup Case
        () => !isEmpty(nodeGroup),
        ({ TargetGroupArn }) =>
          pipe([
            () => findAutoScalingGroup({ nodeGroup }),
            ({ AutoScalingGroupName }) => ({
              AutoScalingGroupName,
              TargetGroupARNs: [TargetGroupArn],
            }),
            tap(({ AutoScalingGroupName }) => {
              logger.info(
                `attachLoadBalancerTargetGroups ${AutoScalingGroupName}`
              );
            }),
            (params) => autoScaling().attachLoadBalancerTargetGroups(params),
          ])(),
        // AutoScaling Group Case
        () => !isEmpty(autoScalingGroup),
        ({ TargetGroupArn }) =>
          pipe([
            () => ({
              AutoScalingGroupName: autoScalingGroup.live?.AutoScalingGroupName,
              TargetGroupARNs: [TargetGroupArn],
            }),
            (params) => autoScaling().attachLoadBalancerTargetGroups(params),
          ])(),
        identity,
      ]),
      tap((result) => {
        logger.info(`created target group ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#deleteTargetGroup-property
  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId({ live }), name: findName({ live }) }),
      ({ id, name }) =>
        pipe([
          tap(() => {
            logger.info(`destroy target group ${JSON.stringify({ id })}`);
          }),
          () => ({
            TargetGroupArn: id,
          }),
          (params) => elb().deleteTargetGroup(params),
          tap(() =>
            retryCall({
              name: `target group isDownById: ${id}`,
              fn: () => isDownById({ id }),
              config,
            })
          ),
          tap(() => {
            logger.info(`destroyed target group ${JSON.stringify({ name })}`);
          }),
        ])(),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#createTargetGroup-property
  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies: { vpc },
  }) =>
    pipe([
      tap(() => {
        assert(vpc);
      }),
      () => properties,
      defaultsDeep({
        Name: name,
        Protocol: "HTTP",
        VpcId: getField(vpc, "VpcId"),
        Tags: buildTags({ name, namespace, config }),
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    findDependencies,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
