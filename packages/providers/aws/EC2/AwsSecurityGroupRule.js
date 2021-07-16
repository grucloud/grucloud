const assert = require("assert");
const {
  get,
  pipe,
  eq,
  and,
  tap,
  filter,
  switchCase,
  tryCatch,
  not,
  map,
} = require("rubico");
const { size, includes, defaultsDeep, isEmpty, identity } = require("rubico/x");
const logger = require("@grucloud/core/logger")({ prefix: "AwsSecGroupRule" });
const { tos } = require("@grucloud/core/tos");

const { getField } = require("@grucloud/core/ProviderCommon");

const {
  Ec2New,
  shouldRetryOnException,
  buildTags,
  findNamespaceInTags,
  findNameInTags,
} = require("../AwsCommon");

exports.createResource = ({}) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ])();

const findId = get("live.SecurityGroupRuleId");

const protocolFromToPortToName = ({ IpProtocol, FromPort, ToPort }) =>
  switchCase([
    () => includes(IpProtocol)(["tcp", "udp"]),
    () => `${IpProtocol}-${FromPort}${ToPort != FromPort ? `-${ToPort}` : ""}`,
    eq(() => IpProtocol, "-1"),
    () => "all",
    () => IpProtocol,
  ])();

const groupNameFromId = ({ GroupId, lives, config }) =>
  pipe([
    () =>
      lives.getById({
        id: GroupId,
        providerName: config.providerName,
        type: "SecurityGroup",
      }),
    tap((params) => {
      assert(true);
    }),
    get("name"),
  ])();

const ipVersion = ({ CidrIpv4, CidrIpv6 }) =>
  switchCase([
    () => CidrIpv4,
    () => "-v4",
    () => CidrIpv6,
    () => "-v6",
    () => "",
  ])();

//TODO fetch groupName from GroupId
const fromSecurityGroup = ({ ReferencedGroupInfo }) =>
  pipe([
    () => ReferencedGroupInfo,
    get("GroupId"),
    switchCase([not(isEmpty), (GroupId) => `-from-${GroupId}`, () => ""]),
  ])();

const ruleDefaultToName = ({
  kind,
  live: {
    IpProtocol,
    FromPort,
    ToPort,
    GroupId,
    CidrIpv4,
    CidrIpv6,
    ReferencedGroupInfo,
  },
  lives,
  config,
}) =>
  `${groupNameFromId({
    GroupId,
    lives,
    config,
  })}-rule-${kind}-${protocolFromToPortToName({
    IpProtocol,
    FromPort,
    ToPort,
  })}${ipVersion({ CidrIpv4, CidrIpv6 })}${fromSecurityGroup({
    ReferencedGroupInfo,
  })}`;

const findSgrNameInTags = ({ live }) =>
  pipe([
    () => ({ live }),
    findNameInTags,
    //switchCase([isEmpty, identity, (name) => `${name}${ipVersion(live)}`]),
    tap((params) => {
      assert(true);
    }),
  ])();

const findName =
  ({ kind, config }) =>
  ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => {
        for (fn of [findSgrNameInTags, ruleDefaultToName]) {
          const name = fn({ live, lives, kind, config });
          if (!isEmpty(name)) {
            return name;
          }
        }
      },
      tap((name) => {
        assert(true);
      }),
    ])();

const findDependencies = ({ live }) => [
  {
    type: "SecurityGroup",
    ids: pipe([
      () => [get("GroupId"), get("ReferencedGroupInfo.GroupId")],
      map((fn) => fn(live)),
      filter(not(isEmpty)),
    ])(),
  },
];

const SecurityGroupRuleBase = ({ config }) => {
  const ec2 = Ec2New(config);
  const { providerName } = config;

  const managedByOther = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(live.GroupId);
      }),
      () =>
        lives.getById({
          type: "SecurityGroup",
          providerName,
          id: live.GroupId,
        }),
      tap((securityGroup) => {
        assert(securityGroup);
      }),
      get("managedByOther"),
    ])();

  const securityFromConfig = ({ securityGroupFrom }) =>
    pipe([
      () => securityGroupFrom,
      switchCase([
        isEmpty,
        () => ({}),
        () => ({
          IpPermissions: [
            {
              UserIdGroupPairs: [
                { GroupId: getField(securityGroupFrom, "GroupId") },
              ],
            },
          ],
        }),
      ]),
    ])();

  const configDefault = async ({
    name,
    namespace,
    properties: { Tags, IpPermission, ...otherProps },
    dependencies: { securityGroup, securityGroupFrom },
  }) =>
    pipe([
      tap(() => {
        assert(securityGroup, "missing securityGroup dependency");
      }),
      () => otherProps,
      defaultsDeep(securityFromConfig({ securityGroupFrom })),
      defaultsDeep({
        GroupId: getField(securityGroup, "GroupId"),
        IpPermissions: [IpPermission],
        TagSpecifications: [
          {
            ResourceType: "security-group-rule",
            Tags: buildTags({ config, namespace, name, UserTags: Tags }),
          },
        ],
      }),
      tap((params) => {
        assert(true);
      }),
    ])();

  const findNamespace = ({ live }) =>
    pipe([
      () => findNamespaceInTags(config)({ live }),
      tap((namespace) => {
        logger.debug(`findNamespace ${namespace}`);
      }),
    ])();

  const getList =
    ({ kind, IsEgress = false }) =>
    ({ resources = [], lives } = {}) =>
      pipe([
        tap((params) => {
          assert(kind);
        }),
        () => ec2().describeSecurityGroupRules({ MaxResults: 1e3 }),
        get("SecurityGroupRules"),
        filter(eq(get("IsEgress"), IsEgress)),
        tap((items) => {
          logger.debug(`getList sg rules ${kind}: ${tos(items)}`);
        }),
        (items) => ({
          total: size(items),
          items,
        }),
        tap(({ total }) => {
          logger.info(`getList #secGroupRule ${kind}: ${total}`);
        }),
      ])();

  const getByName = async ({ name, dependencies, lives }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
        assert(dependencies, "dependencies");
        assert(lives, "lives");
      }),
      () => ({
        MaxResults: 1e3,
        Filters: [{ Name: "tag:Name", Values: [name] }],
      }),
      (params) => ec2().describeSecurityGroupRules(params),
      tap((params) => {
        assert(true);
      }),
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  const create =
    ({ kind, authorizeSecurityGroup }) =>
    ({ payload, name, namespace, resolvedDependencies: { securityGroup } }) =>
      pipe([
        tap(() => {
          logger.info(
            `create sg rule ${JSON.stringify({ kind, name, namespace })}`
          );
          logger.debug(`create sg rule: ${tos(payload)}`);
        }),
        () => payload,
        tap((params) => {
          assert(true);
        }),
        authorizeSecurityGroup,
        tap((result) => {
          logger.info(`created sg rule ${kind} ${tos({ name })}`);
        }),
      ])();

  const destroy =
    ({ kind, revokeSecurityGroup }) =>
    async ({ name, live, lives, resource }) =>
      pipe([
        tap(() => {
          assert(live);
          assert(live);
          assert(lives);
          logger.info(`destroy sg rule ${kind} ${name}`);
          logger.debug(`${kind} ${name}: ${JSON.stringify(live)}`);
        }),
        () => live,
        ({ GroupId, IpProtocol, FromPort, ToPort }) => ({
          GroupId,
          IpPermissions: [{ IpProtocol, FromPort, ToPort }],
        }),
        tap((params) => {
          assert(params);
        }),
        tryCatch(revokeSecurityGroup, (error, params) =>
          pipe([
            tap(() => {
              logger.error(`destroy sg rule error ${tos({ error, params })}`);
            }),
            () => {
              throw { error, params };
            },
          ])()
        ),
        tap((params) => {
          assert(true);
        }),
        tap(() => {
          logger.debug(`destroyed sg rule ${JSON.stringify({ kind, name })}`);
        }),
      ])();

  return {
    findNamespace,
    configDefault,
    getList,
    getByName,
    create,
    destroy,
    managedByOther,
    ec2,
  };
};

const cannotBeDeleted = pipe([
  get("live"),
  tap((params) => {
    assert(params);
  }),
  and([eq(get(`IpProtocol`), "-1"), pipe([get("Tags"), isEmpty])]),
]);

exports.AwsSecurityGroupRuleIngress = ({ spec, config }) => {
  const {
    getList,
    getByName,
    configDefault,
    create,
    destroy,
    findNamespace,
    ec2,
    managedByOther,
  } = SecurityGroupRuleBase({
    config,
  });
  return {
    type: "SecurityGroupRuleIngress",
    spec,
    findId,
    findName: findName({ kind: "ingress", config }),
    findDependencies,
    findNamespace,
    getByName,
    getList: getList({ kind: "ingress", IsEgress: false }),
    create: create({
      kind: "ingress",
      authorizeSecurityGroup: (params) =>
        ec2().authorizeSecurityGroupIngress(params),
    }),
    destroy: destroy({
      kind: "ingress",
      revokeSecurityGroup: pipe([
        tap((params) => {
          assert(true);
        }),
        (params) => ec2().revokeSecurityGroupIngress(params),
      ]),
    }),
    configDefault,
    shouldRetryOnException,
    isDefault: cannotBeDeleted,
    cannotBeDeleted,
    managedByOther,
  };
};

exports.AwsSecurityGroupRuleEgress = ({ spec, config }) => {
  const {
    getList,
    getByName,
    configDefault,
    create,
    destroy,
    findNamespace,
    managedByOther,
    ec2,
  } = SecurityGroupRuleBase({
    config,
  });

  return {
    spec,
    findDependencies,
    findNamespace,
    findId,
    findName: findName({ kind: "egress", config }),
    getByName,
    getList: getList({ kind: "egress", IsEgress: true }),
    create: create({
      kind: "egress",
      authorizeSecurityGroup: (params) =>
        ec2().authorizeSecurityGroupEgress(params),
    }),
    destroy: destroy({
      kind: "egress",
      revokeSecurityGroup: (params) => ec2().revokeSecurityGroupEgress(params),
    }),
    configDefault,
    shouldRetryOnException,
    isDefault: cannotBeDeleted,
    cannotBeDeleted,
    managedByOther,
  };
};
