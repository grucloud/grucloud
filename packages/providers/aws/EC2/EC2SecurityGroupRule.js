const assert = require("assert");
const {
  get,
  pipe,
  eq,
  and,
  tap,
  switchCase,
  tryCatch,
  not,
  or,
  map,
  lte,
  pick,
  flatMap,
  omit,
  assign,
} = require("rubico");
const {
  callProp,
  size,
  includes,
  defaultsDeep,
  isEmpty,
  find,
  first,
  isDeepEqual,
  append,
  pluck,
  when,
} = require("rubico/x");
const util = require("util");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { compareAws, throwIfNotAwsError, isAwsError } = require("../AwsCommon");

const logger = require("@grucloud/core/logger")({ prefix: "AwsSecGroupRule" });
const { tos } = require("@grucloud/core/tos");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");
const { createEC2 } = require("./EC2Common");

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
    () => GroupId,
    lives.getById({
      providerName: config.providerName,
      type: "SecurityGroup",
      group: "EC2",
    }),
    get("name"),
    tap((name) => {
      if (!name) {
        logger.debug("Current SecurityGroups:");
        logger.debug(
          util.inspect(
            lives.getByType({
              providerName: config.providerName,
              type: "SecurityGroup",
              group: "EC2",
            })()
          )
        );
        assert(name, `cannot find ${GroupId}`);
      }
    }),
  ])();

const ruleDefaultToName =
  ({ kind, lives, config }) =>
  ({ GroupId, ...IpPermission }) =>
    pipe([
      tap((params) => {
        assert(kind);
        assert(lives);
        assert(config);
      }),
      () =>
        groupNameFromId({
          GroupId,
          lives,
          config,
        }),
      append("-rule-"),
      append(kind),
      append("-"),
      append(protocolFromToPortToName(IpPermission)),
      // append(
      //   fromSecurityGroup({
      //     lives,
      //     config,
      //   })(IpPermission)
      // ),
      tap((name) => {
        //logger.debug(`rule name: ${name}`);
      }),
    ])();

const addIcmpPorts = when(
  eq(get("IpProtocol"), "icmp"),
  defaultsDeep({ ToPort: -1, FromPort: -1 })
);

exports.addIcmpPorts = addIcmpPorts;

exports.inferNameSecurityGroupRule =
  ({ kind }) =>
  ({ dependenciesSpec: { securityGroup, securityGroupFrom } }) =>
  ({ ...IpPermission }) =>
    pipe([
      tap(() => {
        assert(securityGroup);
        assert(IpPermission);
        assert(kind);
      }),
      () => securityGroup,
      append("-rule-"),
      append(kind),
      append("-"),
      append(protocolFromToPortToName(IpPermission)),
      //when(() => securityGroupFrom, append(`-from-${securityGroupFrom}`)),
      tap((params) => {
        assert(true);
      }),
    ])();

const findName =
  ({ kind }) =>
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap(() => {
        //assert(live.IpPermission, `no IpPermission in ${tos(live)}`);
        assert(lives);
      }),
      //TODO
      () => {
        for (fn of [/*findNameInTags({ findId })*/ ruleDefaultToName]) {
          const name = fn({ lives, kind, config })(live);
          if (!isEmpty(name)) {
            return name;
          }
        }
      },
      tap((name) => {
        assert(true);
      }),
    ])();

const SecurityGroupRuleBase = ({ config }) => {
  const ec2 = createEC2(config);
  const isDefault =
    ({ IsEgress }) =>
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(live.GroupId);
          assert(lives.getById);
        }),
        () => live,
        or([
          // Elastic Beanstalk
          pipe([get("GroupName"), callProp("startsWith", "awseb-")]),
          and([
            pipe([
              get("UserIdGroupPairs"),
              and([
                lte(size, 1),
                pipe([first, or([isEmpty, eq(get("GroupId"), live.GroupId)])]),
              ]),
            ]),
            or([
              () => IsEgress,
              and([
                pipe([
                  get("GroupId"),
                  lives.getById({
                    type: "SecurityGroup",
                    group: "EC2",
                    providerName: config.providerName,
                  }),
                  get("managedByOther"),
                ]),
              ]),
            ]),
            // Ingress
            pipe([
              pick(["IpProtocol", "FromPort", "ToPort"]),
              (IpPermission) =>
                isDeepEqual(IpPermission, {
                  IpProtocol: "-1",
                }),
            ]),
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
      when(
        () => securityGroupFrom,
        defaultsDeep({
          IpPermissions: pipe([
            () => securityGroupFrom,
            map((sg) => ({
              UserIdGroupPairs: [{ GroupId: getField(sg, "GroupId") }],
            })),
          ])(),
        })
      ),
    ]);

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...IpPermission },
    dependencies: { securityGroup, securityGroupFrom, prefixLists },
  }) =>
    pipe([
      tap(() => {
        assert(securityGroup, "missing securityGroup dependency");
      }),
      () => IpPermission,
      addIcmpPorts,
      when(
        () => prefixLists,
        assign({
          PrefixListIds: pipe([
            () => prefixLists,
            map((pl) => ({ PrefixListId: getField(pl, "PrefixListId") })),
          ]),
        })
      ),
      (IpPermissionWithPrefix) =>
        pipe([
          () => ({}),
          securityFromConfig({ securityGroupFrom }),
          defaultsDeep({
            GroupId: getField(securityGroup, "GroupId"),
            IpPermissions: [IpPermissionWithPrefix],
            TagSpecifications: [
              {
                ResourceType: "security-group-rule",
                Tags: buildTags({ config, namespace, UserTags: Tags }),
              },
            ],
          }),
        ])(),
    ])();

  const findNamespace =
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        get("GroupId"),
        lives.getById({
          type: "SecurityGroup",
          group: "EC2",
          providerName: config.providerName,
        }),
        get("namespace"),
      ])();

  const securityGroupToRules = ({ IsEgress }) =>
    pipe([
      flatMap(({ GroupId, GroupName, IpPermissions, IpPermissionsEgress }) =>
        pipe([
          switchCase([
            () => IsEgress,
            () => IpPermissionsEgress,
            () => IpPermissions,
          ]),
          map(
            pipe([
              omitIfEmpty([
                "UserIdGroupPairs",
                "PrefixListIds",
                "IpRanges",
                "Ipv6Ranges",
              ]),
              (IpPermission) => ({ GroupId, GroupName, ...IpPermission }),
            ])
          ),
        ])()
      ),
    ]);

  //TODO add common describeSecurityGroupRules
  const getList =
    ({ IsEgress = false }) =>
    ({ resources = [], lives } = {}) =>
      pipe([
        lives.getByType({
          type: "SecurityGroup",
          group: "EC2",
          providerName: config.providerName,
        }),
        pluck("live"),
        securityGroupToRules({ IsEgress }),
        tap((rules) => {
          assert(rules);
        }),
      ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSecurityGroupRules-property
  const getByName =
    ({ kind, IsEgress = false, config }) =>
    ({ name, lives, resolvedDependencies, ...otherProp }) =>
      pipe([
        tap(() => {
          logger.info(`getByName sgr ${kind} ${name}`);
          assert(otherProp);
          assert(lives);
          assert(resolvedDependencies);
          assert(resolvedDependencies.securityGroup.live.GroupId);
        }),
        () => ({
          MaxResults: 1e3,
          Filters: [
            {
              Name: "group-id",
              Values: [resolvedDependencies.securityGroup.live.GroupId],
            },
          ],
        }),
        tap((params) => {
          assert(true);
        }),
        ec2().describeSecurityGroups,
        get("SecurityGroups"),
        tap((SecurityGroups) => {
          logger.debug(`getByName ${name} ${tos({ SecurityGroups })}`);
        }),
        securityGroupToRules({ IsEgress }),
        tap((rules) => {
          logger.debug(`getByName ${name} rules: ${tos(rules)}`);
        }),
        //map(ruleDefaultToName({ kind, lives, config })),
        tap((params) => {
          assert(true);
        }),
        tap(
          pipe([
            map(ruleDefaultToName({ kind, lives, config })),
            tap((names) => {
              logger.debug(`getByName all names ${name}`);
              logger.debug(names.join("\n"));
            }),
          ])
        ),
        find(eq(ruleDefaultToName({ kind, lives, config }), name)),
        tap((result) => {
          logger.debug(`getByName ${name} result: ${tos(result)}`);
        }),
      ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupEgress-property
  const create =
    ({ kind, authorizeSecurityGroup }) =>
    ({ payload, name, namespace, dependencies, resolvedDependencies, lives }) =>
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
            throw Error(
              `cannot create security group rule ${name}, ${util.inspect(
                result
              )}`
            );
          }),
          tap(() =>
            dependencies().securityGroup.getLive({
              lives,
              resolvedDependencies,
            })
          ),
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
        }),
        () => live,
        ({ GroupId, GroupName, ...IpPermission }) => ({
          GroupId,
          ...(IpPermission && {
            IpPermissions: [IpPermission],
          }),
        }),
        tap((params) => {
          logger.debug(
            `rule: ${kind} ${name}: ${JSON.stringify(params, null, 4)}`
          );
        }),
        tryCatch(revokeSecurityGroup(), (error, params) =>
          pipe([
            tap(() => {
              logger.error(`destroy sg rule error ${tos({ error, params })}`);
            }),
            () => error,
            switchCase([
              isAwsError("InvalidGroup.NotFound"),
              () => undefined,
              () => {
                throw Error(error.message);
              },
            ]),
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

exports.EC2SecurityGroupRuleIngress = ({ spec, config }) => {
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
    findId: () =>
      pipe([
        ({ GroupId, ...IpPermission }) =>
          `ingress::${GroupId}::${JSON.stringify(IpPermission)}`,
      ]),
    findName: findName({ kind: "ingress" }),
    findNamespace,
    getByName: getByName({ kind: "ingress", IsEgress: false, config }),
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

exports.EC2SecurityGroupRuleEgress = ({ spec, config }) => {
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
    findNamespace,
    findId: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        ({ GroupId, ...IpPermission }) =>
          `egress::${GroupId}::${JSON.stringify(IpPermission)}`,
      ]),
    findName: findName({ kind: "egress" }),
    getByName: getByName({ kind: "egress", IsEgress: true, config }),
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
  getTargetTags: () => [],
  getLiveTags: () => [],
})({
  filterAll: () =>
    pipe([omit(["UserIdGroupPairs", "SecurityGroupRuleId", "GroupName"])]),
  filterTarget: () =>
    pipe([
      ({ GroupId, PrefixListIds, IpPermissions }) => ({
        GroupId,
        PrefixListIds,
        ...IpPermissions[0],
      }),
    ]),
  filterLive: () => pipe([omit(["UserIdGroupPairs", "Tags"])]),
});
