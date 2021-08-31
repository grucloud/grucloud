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
  hasKeyInTags,
} = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");

const findName = get("live.TargetGroupName");
const findId = get("live.TargetGroupArn");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html

exports.ELBTargetGroup = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const elb = ELBv2New(config);
  const autoScaling = AutoScalingNew(config);

  const managedByOther = hasKeyInTags({
    key: "elbv2.k8s.aws/cluster",
  });

  // TODO findDependencies
  const findDependencies = ({ live }) => [
    { type: "Vpc", group: "EC2", ids: [live.VpcId] },
    { type: "LoadBalancer", group: "ELBv2", ids: live.LoadBalancerArns },
    // TODO eks.NodeGroup
  ];

  const findNamespace = findNamespaceInTagsOrEksCluster({
    config,
    key: "elbv2.k8s.aws/cluster",
  });

  //TODO rubico unless
  const assignTags = switchCase([
    not(isEmpty),
    assign({
      Tags: pipe([
        tap(({ TargetGroupArn }) => {
          assert(TargetGroupArn);
        }),
        ({ TargetGroupArn }) =>
          elb().describeTags({ ResourceArns: [TargetGroupArn] }),
        get("TagDescriptions"),
        first,
        get("Tags"),
      ]),
    }),
    identity,
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ELBv2.html#describeTargetGroups-property
  const getList = () =>
    pipe([
      tap(() => {
        logger.info(`getList target group`);
      }),
      elb().describeTargetGroups,
      get("TargetGroups"),
      map(assignTags),
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
      assignTags,
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
  const create = async ({ name, payload, dependencies }) =>
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
      ({ TargetGroupArn }) =>
        pipe([
          dependencies,
          switchCase([
            // NodeGroup Case
            get("nodeGroup"),
            ({ nodeGroup }) =>
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
                (params) =>
                  autoScaling().attachLoadBalancerTargetGroups(params),
              ])(),
            // AutoScaling Group Case
            get("autoScalingGroup"),
            ({ autoScalingGroup }) =>
              pipe([
                () => ({
                  AutoScalingGroupName:
                    autoScalingGroup.live?.AutoScalingGroupName,
                  TargetGroupARNs: [TargetGroupArn],
                }),
                (params) =>
                  autoScaling().attachLoadBalancerTargetGroups(params),
              ])(),
            identity,
          ]),
        ])(),

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
    managedByOther,
  };
};
