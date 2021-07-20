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
  fork,
  assign,
} = require("rubico");
const {
  callProp,
  size,
  includes,
  defaultsDeep,
  isEmpty,
  find,
  identity,
  first,
  groupBy,
  values,
} = require("rubico/x");
const logger = require("@grucloud/core/logger")({ prefix: "AwsSecGroupRule" });
const { tos } = require("@grucloud/core/tos");
const { findValueInTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  Ec2New,
  shouldRetryOnException,
  buildTags,
  findNamespaceInTags,
  findNameInTags,
} = require("../AwsCommon");

const findProperty = (property) =>
  pipe([
    get("rules"),
    find(callProp("hasOwnProperty", property)),
    get(property),
  ]);

const mergeSecurityGroupRules = (rules) =>
  pipe([
    () => rules,
    groupBy((rule) =>
      pipe([
        () => rule,
        findValueInTags({ key: "Name" }),
        switchCase([isEmpty, () => get("SecurityGroupRuleId")(rule), identity]),
      ])()
    ),
    values,
    map(
      pipe([
        fork({
          ruleIpv4: find(get("CidrIpv4")),
          ruleIpv6: find(get("CidrIpv6")),
          ruleFrom: find(get("ReferencedGroupInfo")),
        }),
        assign({
          rules: ({ ruleIpv4, ruleIpv6, ruleFrom }) =>
            pipe([
              () => [ruleIpv4, ruleIpv6, ruleFrom],
              filter(not(isEmpty)),
            ])(),
        }),
        assign({
          GroupId: findProperty("GroupId"),
          SecurityGroupRuleId: findProperty("SecurityGroupRuleId"),
          Tags: findProperty("Tags"),
          IpProtocol: findProperty("IpProtocol"),
          FromPort: findProperty("FromPort"),
          ToPort: findProperty("ToPort"),
        }),
        ({
          ruleIpv4,
          ruleIpv6,
          ruleFrom,
          GroupId,
          SecurityGroupRuleId,
          Tags,
          IpProtocol,
          FromPort,
          ToPort,
        }) => ({
          GroupId,
          SecurityGroupRuleId,
          IpPermission: {
            IpProtocol,
            FromPort,
            ToPort,
            ...(ruleIpv4 && {
              IpRanges: [
                {
                  CidrIp: ruleIpv4.CidrIpv4,
                },
              ],
              ...(ruleIpv6 && {
                Ipv6Ranges: [
                  {
                    CidrIpv6: ruleIpv6.CidrIpv6,
                  },
                ],
              }),
            }),
            ...(ruleFrom && {
              UserIdGroupPairs: [
                { GroupId: ruleFrom.ReferencedGroupInfo.GroupId },
              ],
            }),
          },
          Tags,
        }),
      ])
    ),
  ])();

exports.mergeSecurityGroupRules = mergeSecurityGroupRules;

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

const ipVersion = ({ IpRanges, Ipv6Ranges }) =>
  switchCase([
    () => IpRanges,
    () => "-v4",
    () => Ipv6Ranges,
    () => "-v6",
    () => "",
  ])();

//TODO fetch groupName from GroupId
const fromSecurityGroup = ({ UserIdGroupPairs }) =>
  pipe([
    () => UserIdGroupPairs,
    first,
    get("GroupId"),
    switchCase([not(isEmpty), (GroupId) => `-from-${GroupId}`, () => ""]),
  ])();

const ruleDefaultToName = ({
  kind,
  live: {
    GroupId,
    IpPermission: {
      IpProtocol,
      FromPort,
      ToPort,
      IpRanges,
      Ipv6Ranges,
      UserIdGroupPairs,
    },
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
  })}${ipVersion({ IpRanges, Ipv6Ranges })}${fromSecurityGroup({
    UserIdGroupPairs,
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
    group: "ec2",
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
        tap((rules) => {
          logger.debug(`getList raw sg rules ${kind}: ${tos(rules)}`);
        }),
        mergeSecurityGroupRules,
        tap((rules) => {
          logger.debug(`getList merged sg rules ${kind}: ${tos(rules)}`);
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
      get("SecurityGroupRules"),
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
        ({ GroupId, IpPermission }) => ({
          GroupId,
          ...(IpPermission && {
            IpPermissions: [IpPermission],
          }),
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
              throw Error(error.message);
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
    managedByOther,
  };
};
