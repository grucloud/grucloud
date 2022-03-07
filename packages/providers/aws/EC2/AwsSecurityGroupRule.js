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
  or,
  map,
  fork,
  assign,
  pick,
  omit,
} = require("rubico");
const {
  callProp,
  size,
  includes,
  defaultsDeep,
  isEmpty,
  find,
  first,
  groupBy,
  values,
  isDeepEqual,
  uniq,
  when,
} = require("rubico/x");

const { compareAws, throwIfNotAwsError } = require("../AwsCommon");

const logger = require("@grucloud/core/logger")({ prefix: "AwsSecGroupRule" });
const { tos } = require("@grucloud/core/tos");
const { findValueInTags } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags, findNameInTags, findEksCluster } = require("../AwsCommon");
//const { AwsClient } = require("../AwsClient");
const { createEC2 } = require("./EC2Common");

const findProperty = (property) =>
  pipe([
    get("rules"),
    find(callProp("hasOwnProperty", property)),
    get(property),
  ]);

const mergeSecurityGroupRules = (rules) =>
  pipe([
    tap((params) => {
      logger.debug(`mergeSecurityGroupRules #rules: ${size(rules)}`);
    }),
    () => rules,
    groupBy((rule) =>
      pipe([
        () => rule,
        findValueInTags({ key: "Name" }),
        when(isEmpty, () => get("SecurityGroupRuleId")(rule)),
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
        group: "EC2",
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

const fromSecurityGroup = ({ UserIdGroupPairs, lives, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    () => UserIdGroupPairs,
    first,
    get("GroupId"),
    (GroupId) =>
      pipe([
        () =>
          lives.getByType({
            type: "SecurityGroup",
            group: "EC2",
            providerName: config.providerName,
          }),
        find(eq(get("id"), GroupId)),
        get("name"),
        switchCase([not(isEmpty), (name) => `-from-${name}`, () => ""]),
      ])(),
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
    lives,
    config,
  })}`;

const findName =
  ({ kind, config }) =>
  ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(true);
        assert(live.IpPermission, `no IpPermission in ${tos(live)}`);
      }),
      () => {
        for (fn of [findNameInTags({ findId }), ruleDefaultToName]) {
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

const findDependencies =
  ({ config }) =>
  ({ live, lives }) =>
    [
      {
        type: "SecurityGroup",
        group: "EC2",
        ids: pipe([
          () => [
            get("GroupId"),
            get("IpPermission.UserIdGroupPairs[0].GroupId"),
          ],
          map((fn) => fn(live)),
          uniq,
          filter(not(isEmpty)),
        ])(),
      },
      {
        type: "Cluster",
        group: "EKS",
        ids: [
          pipe([
            () =>
              lives.getById({
                id: live.GroupId,
                type: "SecurityGroup",
                group: "EC2",
                providerName: config.providerName,
              }),
            tap(({ live }) => {
              assert(live, "cannot find security group in cache");
            }),
            ({ live }) => ({ live, lives }),
            findEksCluster({ config }),
            get("id"),
          ])(),
        ],
      },
    ];

const SecurityGroupRuleBase = ({ config }) => {
  const ec2 = createEC2(config);
  const isDefault =
    ({ IsEgress }) =>
    ({ live, lives }) =>
      pipe([
        tap(() => {
          assert(live.GroupId);
          assert(lives.getById);
        }),
        and([
          or([
            () => IsEgress,
            and([
              pipe([
                () =>
                  lives.getById({
                    type: "SecurityGroup",
                    group: "EC2",
                    providerName: config.providerName,
                    id: live.GroupId,
                  }),
                get("managedByOther"),
              ]),
              pipe([
                () => live,
                get("IpPermission.UserIdGroupPairs"),
                first,
                or([isEmpty, eq(get("GroupId"), live.GroupId)]),
              ]),
            ]),
          ]),
          pipe([
            () => live,
            get("IpPermission"),
            pick(["IpProtocol", "FromPort", "ToPort"]),
            (IpPermission) =>
              isDeepEqual(IpPermission, {
                IpProtocol: "-1",
                FromPort: -1,
                ToPort: -1,
              }),
          ]),
        ]),
        tap((result) => {
          // logger.debug(
          //   `securityGroupRule IsEgress: ${IsEgress}, ${tos(
          //     live
          //   )} isDefault ${result}`
          // );
        }),
      ])();

  const managedByOther = isDefault;

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

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, IpPermission, ...otherProps },
    dependencies: { securityGroup, securityGroupFrom },
  }) =>
    pipe([
      tap(() => {
        assert(securityGroup, "missing securityGroup dependency");
      }),
      () => securityFromConfig({ securityGroupFrom }),
      defaultsDeep(otherProps),
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

  const findNamespace = ({ live, lives }) =>
    pipe([
      () =>
        lives.getById({
          id: live.GroupId,
          type: "SecurityGroup",
          group: "EC2",
          providerName: config.providerName,
        }),
      get("namespace"),
    ])();

  //TODO add common describeSecurityGroupRules
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
          assert(rules);
        }),
      ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSecurityGroupRules-property
  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName sgr ${name}`);
      }),
      () => ({
        MaxResults: 1e3,
        Filters: [{ Name: "tag:Name", Values: [name] }],
      }),
      ec2().describeSecurityGroupRules,
      get("SecurityGroupRules"),
      tap((SecurityGroupRules) => {
        logger.debug(`getByName ${name} ${tos({ SecurityGroupRules })}`);
      }),
      mergeSecurityGroupRules,
      first,
      tap((result) => {
        logger.debug(`getByName ${name} result: ${tos(result)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupEgress-property
  const create =
    ({ kind, authorizeSecurityGroup }) =>
    ({ payload, name, namespace }) =>
      tryCatch(
        pipe([
          tap(() => {
            logger.info(
              `create sg rule ${JSON.stringify({ kind, name, namespace })}`
            );
            logger.debug(`create sg rule: ${tos(payload)}`);
          }),
          () => payload,
          authorizeSecurityGroup(),
          tap.if(not(get("Return")), (result) => {
            throw Error(`cannot create security group rule ${name}`);
          }),
          tap((result) => {
            logger.info(`created sg rule ${kind}, ${name} ${tos({ result })}`);
          }),
        ]),
        throwIfNotAwsError("InvalidPermission.Duplicate")
      )();

  const destroy =
    ({ kind, revokeSecurityGroup }) =>
    ({ name, live, lives, resource }) =>
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
        tryCatch(revokeSecurityGroup(), (error, params) =>
          pipe([
            tap(() => {
              logger.error(`destroy sg rule error ${tos({ error, params })}`);
            }),
            () => {
              throw Error(error.message);
            },
          ])()
        ),
        tap(() => {
          logger.debug(`destroyed sg rule ${JSON.stringify({ kind, name })}`);
        }),
      ])();

  const update =
    ({ kind, authorizeSecurityGroup, revokeSecurityGroup }) =>
    ({ payload, name, namespace, diff, live, lives }) =>
      pipe([
        tap(() => {
          logger.info(
            `update sg rule ${JSON.stringify({ kind, name, namespace })}`
          );
        }),
        () => ({ name, payload, namespace, live, lives }),
        tap(destroy({ kind, revokeSecurityGroup })),
        tap(create({ kind, authorizeSecurityGroup })),
      ])();

  return {
    findNamespace,
    configDefault,
    getList,
    getByName,
    create,
    update,
    destroy,
    isDefault,
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
    update,
    destroy,
    findNamespace,
    ec2,
    managedByOther,
    isDefault,
  } = SecurityGroupRuleBase({
    config,
  });
  return {
    type: "SecurityGroupRuleIngress",
    spec,
    findId,
    findName: findName({ kind: "ingress", config }),
    findDependencies: findDependencies({ config }),
    findNamespace,
    getByName,
    getList: getList({ kind: "ingress", IsEgress: false }),
    create: create({
      kind: "ingress",
      authorizeSecurityGroup: () => ec2().authorizeSecurityGroupIngress,
    }),
    update: update({
      kind: "ingress",
      authorizeSecurityGroup: () => ec2().authorizeSecurityGroupIngress,
      revokeSecurityGroup: () => ec2().revokeSecurityGroupIngress,
    }),
    destroy: destroy({
      kind: "ingress",
      revokeSecurityGroup: () => ec2().revokeSecurityGroupIngress,
    }),
    configDefault,
    managedByOther: managedByOther({ IsEgress: false }),
    isDefault: isDefault({ IsEgress: false }),
  };
};

exports.AwsSecurityGroupRuleEgress = ({ spec, config }) => {
  const {
    getList,
    getByName,
    configDefault,
    create,
    update,
    destroy,
    findNamespace,
    isDefault,
    managedByOther,
    ec2,
  } = SecurityGroupRuleBase({
    config,
  });

  return {
    spec,
    findDependencies: findDependencies({ config }),
    findNamespace,
    findId,
    findName: findName({ kind: "egress", config }),
    getByName,
    getList: getList({ kind: "egress", IsEgress: true }),
    create: create({
      kind: "egress",
      authorizeSecurityGroup: () => ec2().authorizeSecurityGroupEgress,
    }),
    update: update({
      kind: "egress",
      authorizeSecurityGroup: () => ec2().authorizeSecurityGroupEgress,
      revokeSecurityGroup: () => ec2().revokeSecurityGroupEgress,
    }),
    destroy: destroy({
      kind: "egress",
      revokeSecurityGroup: () => ec2().revokeSecurityGroupEgress,
    }),
    configDefault,
    managedByOther: managedByOther({ IsEgress: true }),
    isDefault: isDefault({ IsEgress: true }),
  };
};

exports.compareSecurityGroupRule = compareAws({
  filterAll: pipe([
    omit(["IpPermission.UserIdGroupPairs", "SecurityGroupRuleId"]),
  ]),
  filterTarget: () =>
    pipe([
      ({ GroupId, IpPermissions }) => ({
        GroupId,
        IpPermission: IpPermissions[0],
      }),
    ]),
  filterLive: () => pipe([omit(["IpPermission.UserIdGroupPairs", "Tags"])]),
});
