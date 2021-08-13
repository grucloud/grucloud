const assert = require("assert");
const {
  get,
  pipe,
  map,
  eq,
  or,
  tap,
  fork,
  filter,
  not,
  tryCatch,
  switchCase,
  omit,
  pick,
} = require("rubico");
const {
  find,
  defaultsDeep,
  pluck,
  flatten,
  isEmpty,
  identity,
} = require("rubico/x");
const {
  Ec2New,
  getByIdCore,
  shouldRetryOnException,
  buildTags,
  findNamespaceInTagsOrEksCluster,
  revokeSecurityGroupIngress,
} = require("../AwsCommon");
const { retryCall } = require("@grucloud/core/Retry");
const { getField } = require("@grucloud/core/ProviderCommon");
const { hasKeyInTags } = require("../AwsCommon");

const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const logger = require("@grucloud/core/logger")({ prefix: "AwsSecurityGroup" });
const { tos } = require("@grucloud/core/tos");

exports.AwsSecurityGroup = ({ spec, config }) => {
  const { managedByDescription, providerName } = config;
  assert(managedByDescription);
  assert(providerName);

  const ec2 = Ec2New(config);

  const findName = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(lives);
      }),
      () => live,
      get("GroupName"),
      switchCase([
        eq(identity, "default"),
        pipe([
          () => lives.getByType({ type: "Vpc", group: "ec2", providerName }),
          find(eq(get("live.VpcId"), live.VpcId)),
          tap((vpc) => {
            //assert(vpc);
          }),
          get("name"),
          tap((vpcName) => {
            //assert(vpcName);
          }),
          (vpcName) => `sg-default-${vpcName}`,
          tap((xxx) => {
            assert(true);
          }),
        ]),
        identity,
      ]),
    ])();

  const findId = get("live.GroupId");
  const findDependencies = ({ live }) => [
    { type: "Vpc", group: "ec2", ids: [live.VpcId] },
    {
      type: "SecurityGroup",
      group: "ec2",
      ids: pipe([
        () => live,
        get("IpPermissions"),
        pluck("UserIdGroupPairs"),
        flatten,
        pluck("GroupId"),
      ])(),
    },
  ];

  const findNamespace = (param) =>
    pipe([
      () => [
        findNamespaceInTagsOrEksCluster({
          config,
          key: "aws:eks:cluster-name",
        })(param),
        findNamespaceInTagsOrEksCluster({
          config,
          key: "elbv2.k8s.aws/cluster",
        })(param),
      ],
      find(not(isEmpty)),
      tap((namespace) => {
        logger.debug(`findNamespace ${namespace}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSecurityGroups-property
  const getList = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`list sg ${JSON.stringify(params)}`);
      }),
      () => ec2().describeSecurityGroups(params),
      get("SecurityGroups"),
      tap((securityGroups) => {
        logger.debug(`list sg result: ${tos(securityGroups)}`);
      }),
      (securityGroups) => ({
        total: securityGroups.length,
        items: securityGroups,
      }),
      tap(({ total }) => {
        logger.info(`list #sg ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });
  const getById = getByIdCore({ fieldIds: "GroupIds", getList });

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  const cannotBeDeleted = pipe([
    get("live"),
    or([
      eq(get("GroupName"), "default"),
      //pipe([get("Tags"), find(eq(get("Key"), "aws:eks:cluster-name"))]),
    ]),
  ]);
  const isDefault = cannotBeDeleted;

  const managedByOther = or([
    hasKeyInTags({
      key: "aws:eks:cluster-name",
    }),
    hasKeyInTags({
      key: "elbv2.k8s.aws/cluster",
    }),
    isDefault,
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property

  const create = ({ payload, name }) =>
    pipe([
      tap(() => {
        logger.info(`create sg ${tos({ name })}`);
      }),
      () =>
        ec2().createSecurityGroup({
          Description: managedByDescription,
          GroupName: name,
          ...payload.create,
        }),
      get("GroupId"),
      tap((GroupId) =>
        pipe([
          () =>
            retryCall({
              name: `sg create isUpById: ${name} id: ${GroupId}`,
              fn: () => isUpById({ id: GroupId, name }),
              config,
            }),
          fork({
            ingress: tap.if(
              () => payload.ingress,
              () =>
                ec2().authorizeSecurityGroupIngress({
                  GroupId,
                  ...payload.ingress,
                })
            ),
            egress: tap.if(
              () => payload.egress,
              () =>
                ec2().authorizeSecurityGroupEgress({
                  GroupId,
                  ...payload.egress,
                })
            ),
          }),
        ])()
      ),
      tap((GroupId) => {
        logger.info(`created sg ${tos({ name, GroupId })}`);
      }),
      (id) => ({ id }),
    ])();

  const revokeIngressRules = (live) =>
    pipe([
      tap(() => {
        logger.debug(`revokeIngressRules`);
      }),
      () => live.IpPermissions,
      filter(pipe([get("UserIdGroupPairs"), not(isEmpty)])),
      map(
        pipe([
          omit(["IpRanges", "Ipv6Ranges", "PrefixListIds"]),
          (ipPermission) => ({
            GroupId: live.GroupId,
            IpPermissions: [ipPermission],
          }),
          revokeSecurityGroupIngress({ ec2 }),
        ])
      ),
    ])();

  const destroy = ({ live, lives }) =>
    pipe([
      () => ({
        name: findName({ live, lives }),
        GroupId: findId({ live, lives }),
      }),
      ({ name, GroupId }) =>
        pipe([
          tap(() => {
            logger.info(`destroy sg ${JSON.stringify({ name, GroupId })}`);
            logger.debug(`destroy sg ${JSON.stringify(live)}`);
          }),
          () => revokeIngressRules(live),
          //() => destroyNetworkInterfaces({ ec2, Name: "group-id", Values: [id] }),
          () =>
            retryCall({
              name: `deleteSecurityGroup: ${name}`,
              fn: () => ec2().deleteSecurityGroup({ GroupId }),
              config: { retryCount: 20, repeatDelay: 5e3 },
              isExpectedException: pipe([
                tap((ex) => {
                  logger.error(
                    `delete sg ${name} isExpectedException ? ${tos(ex)}`
                  );
                }),
                eq(get("code"), "InvalidGroup.NotFound"),
              ]),
              shouldRetryOnException: ({ error, name }) =>
                pipe([
                  () => error,
                  tap(() => {
                    logger.error(
                      `delete sg ${name} shouldRetryOnException ? ${tos({
                        name,
                        error,
                      })}`
                    );
                  }),
                  eq(get("code"), "DependencyViolation"),
                ])(),
            }),
          tap(() =>
            retryCall({
              name: `destroy sg isDownById: ${name} GroupId: ${GroupId}`,
              fn: () => isDownById({ id: GroupId }),
              config,
            })
          ),
          tap(() => {
            logger.debug(`destroyed sg ${JSON.stringify({ name, GroupId })}`);
          }),
        ])(),
    ])();

  const configDefault = async ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies,
  }) => {
    const { vpc } = dependencies;
    //assert(vpc, "missing vpc dependency");
    return defaultsDeep(otherProps)({
      create: {
        ...(vpc && { VpcId: getField(vpc, "VpcId") }),
        TagSpecifications: [
          {
            ResourceType: "security-group",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      },
    });
  };

  return {
    spec,
    getByName,
    findId,
    findName,
    findDependencies,
    findNamespace,
    isDefault,
    cannotBeDeleted,
    managedByOther,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
