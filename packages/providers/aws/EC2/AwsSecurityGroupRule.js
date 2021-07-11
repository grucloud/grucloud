const assert = require("assert");
const {
  get,
  pipe,
  map,
  eq,
  and,
  tap,
  filter,
  not,
  omit,
  switchCase,
  tryCatch,
  flatMap,
  fork,
  assign,
  pick,
} = require("rubico");
const {
  size,
  includes,
  defaultsDeep,
  isEmpty,
  isDeepEqual,
  find,
  identity,
  pluck,
} = require("rubico/x");
const {
  Ec2New,
  shouldRetryOnException,
  buildTags,
  findNamespaceInTags,
  findNameInTags,
  findValueInTags,
} = require("../AwsCommon");

const logger = require("@grucloud/core/logger")({ prefix: "AwsSecGroupRule" });
const { tos } = require("@grucloud/core/tos");

const GC_SG_PREFIX = "gc-sg-";
const buildSgRuleTagKey = (name) => `${GC_SG_PREFIX}${name}`;

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

const ruleDefaultToName = ({
  kind,
  live: {
    IpPermission: { IpProtocol, FromPort, ToPort },
    GroupId,
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
  })}`;

const findName =
  ({ kind, config }) =>
  ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => {
        for (fn of [findNameInTags, ruleDefaultToName]) {
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

const getSecurityGroup = ({ resource: { name, dependencies = {} }, lives }) =>
  pipe([
    tap(() => {
      assert(name, "getSecurityGroup");
      if (!lives) {
        assert(lives);
      }
    }),
    () => dependencies,
    get("securityGroup"),
    switchCase([
      isEmpty,
      () => {
        throw {
          code: 422,
          message: `security group rule '${name}' is missing the securityGroup dependency'`,
        };
      },
      pipe([
        // TODO get from cache ?
        (securityGroup) => securityGroup.getLive({ lives }),
        tap((live) => {
          logger.debug(`getSecurityGroup securityGroup ${tos(live)}`);
        }),
      ]),
    ]),
  ])();

const findGroupId = (live) =>
  pipe([
    () => live,
    get("GroupId"),
    tap.if(isEmpty, () => {
      throw Error(`Security Group not up: ${tos(live)}`);
    }),
  ])();

const buildKeyNamespace = ({ name }) => `${name}::namespace`;

const findDependencies = ({ live }) => [
  {
    type: "SecurityGroup",
    ids: [live.GroupId],
  },
];

const SecurityGroupRuleBase = ({ config }) => {
  const ec2 = Ec2New(config);
  const { providerName } = config;
  const configDefault = async ({
    name,
    properties: { Tags, ...otherProps },
    dependencies,
  }) => {
    return defaultsDeep(otherProps)({});
  };

  const findNamespace = ({ live }) =>
    pipe([
      () => findNamespaceInTags(config)({ live }),
      tap((namespace) => {
        logger.debug(`findNamespace ${namespace}`);
      }),
    ])();

  const addTags = ({ name, namespace = "", payload, securityGroup }) =>
    pipe([
      () => ({
        Resources: [findGroupId(securityGroup.live)],
        Tags: [
          {
            Key: buildSgRuleTagKey(name),
            Value: JSON.stringify(payload),
          },
          {
            Key: buildKeyNamespace({ name }),
            Value: namespace,
          },
          //TODO
          // ...(namespace && {
          //   Key: buildKeyNamespace({ name }),
          //   Value: namespace,
          // }),
        ],
      }),
      tap((params) => {
        assert(true);
      }),
      (params) => ec2().createTags(params),
    ])();

  const removeTags = ({ name, GroupId }) =>
    pipe([
      () => ({
        Resources: [GroupId],
        Tags: [
          {
            Key: buildSgRuleTagKey(name),
          },
        ],
      }),
      (params) => ec2().deleteTags(params),
    ])();

  const findRuleInSecurityGroup = ({ name, securityGroup }) =>
    pipe([
      () => securityGroup,
      tap(() => {
        assert(name);
        assert(securityGroup);
        logger.debug(
          `findRuleInSecurityGroup ${tos({
            name,
            securityGroupTags: securityGroup.Tags,
          })}`
        );
      }),
      findValueInTags({ key: buildSgRuleTagKey(name) }),
      tap((params) => {
        assert(true);
      }),
      tryCatch(
        pipe([
          JSON.parse,
          tap((params) => {
            assert(true);
          }),
          (payload) => ({
            ...payload,
            Tags: buildTags({
              name,
              namespace: findValueInTags({ key: buildKeyNamespace({ name }) })(
                securityGroup
              ),
              config,
            }),
            GroupId: securityGroup.GroupId,
          }),
        ]),
        (error, tag) =>
          pipe([
            tap(() => {
              logger.error(
                `findRuleInSecurityGroup ${tos(error)}, ${tos(tag)} `
              );
            }),
            () => undefined,
          ])()
      ),
      tap((rule) => {
        logger.debug(`findRuleInSecurityGroup ${name}: ${tos(rule)}`);
      }),
    ])();

  const removeIfEmpty = ({ property }) =>
    pipe([
      switchCase([pipe([get(property), isEmpty]), omit([property]), identity]),
    ]);

  const getListFromSecurityGroup = ({ lives, property }) =>
    pipe([
      tap(() => {
        logger.debug(`getListFromSecurityGroup`);
        assert(lives);
      }),
      () => lives.getByType({ providerName, type: "SecurityGroup" }),
      flatMap((securityGroup) =>
        pipe([
          () => securityGroup,
          get("live"),
          get(property),
          map(
            pipe([
              tap((IpPermission) => {
                assert(true);
              }),
              removeIfEmpty({ property: "PrefixListIds" }),
              removeIfEmpty({ property: "UserIdGroupPairs" }),
              tap((IpPermission) => {
                assert(true);
              }),
              (IpPermission) => ({
                IpPermission,
                GroupId: securityGroup.live.GroupId,
              }),
            ])
          ),
        ])()
      ),
      tap((items) => {
        logger.debug(`getListFromSecurityGroup: ${tos(items)}`);
      }),
    ])();

  const getListFromTarget = ({ resources, lives }) =>
    pipe([
      () => resources,
      tap(() => {
        logger.debug(`getListFromTarget: #resources ${size(resources)}`);
      }),
      map((resource) =>
        pipe([
          tap(() => {
            logger.debug(`getListFromTarget resource ${resource.name}`);
          }),
          () => getSecurityGroup({ resource, lives }),
          tap((params) => {
            assert(true);
          }),
          switchCase([
            isEmpty,
            pipe([
              tap(() => {
                logger.info(
                  `getListFromTarget cannot find sg for resource ${resource.name}`
                );
              }),
              () => null,
            ]),
            (securityGroup) =>
              findRuleInSecurityGroup({ name: resource.name, securityGroup }),
          ]),
        ])()
      ),
      filter(not(isEmpty)),
      tap((items) => {
        logger.debug(`getListFromTarget: ${tos(items)}`);
      }),
    ])();

  const filterLiveRule = pipe([
    assign({
      IpPermission: pipe([
        get("IpPermission"),
        switchCase([
          pipe([get("UserIdGroupPairs"), isEmpty]),
          identity,
          assign({
            UserIdGroupPairs: pipe([
              get("UserIdGroupPairs"),
              map(pick(["GroupId"])),
            ]),
          }),
        ]),
      ]),
    }),
  ]);
  const getList =
    ({ property }) =>
    ({ resources = [], lives } = {}) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        fork({
          liveRules: pipe([
            () => getListFromSecurityGroup({ lives, property }),
            map(filterLiveRule),
          ]),
          targetRules: pipe([() => getListFromTarget({ resources, lives })]),
        }),
        tap((params) => {
          assert(true);
        }),
        ({ liveRules, targetRules }) =>
          pipe([
            () => liveRules,
            tap((params) => {
              assert(true);
            }),
            map((liveRule) =>
              pipe([
                () => targetRules,
                tap((params) => {
                  assert(true);
                }),
                find(
                  pipe([
                    omit(["Tags"]),
                    tap((targetRule) => {
                      logger.debug("getList compare:");
                      logger.debug(`targetRule: ${tos(targetRule)}`);
                      logger.debug(`liveRule:   ${tos(liveRule)}`);
                    }),
                    (targetRule) => isDeepEqual(targetRule, liveRule),
                    tap((equal) => {
                      logger.debug(`sg rule getList equal: ${equal}`);
                    }),
                  ])
                ),
                switchCase([isEmpty, () => liveRule, identity]),
                tap((params) => {
                  assert(true);
                }),
              ])()
            ),
          ])(),
        tap((items) => {
          logger.debug(`getList sg rules: ${tos(items)}`);
        }),
        (items) => ({
          total: items.length,
          items,
        }),
        tap(({ total }) => {
          logger.info(`getList #secGroupRule: ${total}`);
        }),
      ])();

  const getByName = async ({ name, dependencies, lives }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
        assert(dependencies, "dependencies");
        assert(lives, "lives");
      }),
      () => getSecurityGroup({ resource: { dependencies, name }, lives }),
      switchCase([
        not(isEmpty),
        (securityGroup) => findRuleInSecurityGroup({ name, securityGroup }),
        () => {},
      ]),
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  const create =
    ({ kind }) =>
    ({ payload, name, namespace, resolvedDependencies: { securityGroup } }) =>
      pipe([
        tap(() => {
          logger.info(
            `create sg rule ${JSON.stringify({ kind, name, namespace })}`
          );
          logger.debug(`create sg rule: ${tos(payload)}`);
          assert(payload.IpPermission);
        }),
        () => ({
          GroupId: findGroupId(securityGroup.live),
          IpPermissions: [payload.IpPermission],
          Tags: payload.Tags,
        }),
        switchCase([
          eq(kind, "ingress"),
          (params) => ec2().authorizeSecurityGroupIngress(params),
          eq(kind, "egress"),
          (params) => ec2().authorizeSecurityGroupEgress(params),
          () => {
            assert(`invalid kind: '${kind}'`);
          },
        ]),
        () => addTags({ name, namespace, payload, securityGroup }),
        tap(() => {
          logger.info(`created sg rule ${kind} ${tos({ name })}`);
        }),
      ])();

  const destroy =
    ({ kind }) =>
    async ({ name, live, lives, resource }) =>
      pipe([
        tap(() => {
          assert(live);
          assert(live.IpPermission);
          assert(lives);
          logger.info(`destroy sg rule ${kind} ${name}`);
          logger.debug(`${kind} ${name}: ${JSON.stringify(live)}`);
        }),
        () => live.IpPermission,
        omit(["PrefixListIds", "UserIdGroupPairs"]),
        (IpPermission) => ({
          GroupId: live.GroupId,
          IpPermissions: [IpPermission],
        }),
        tap((params) => {
          assert(true);
        }),
        //TODO pass revokeSecurityGroupIngress or revokeSecurityGroupEgress from param
        tryCatch(
          switchCase([
            eq(kind, "ingress"),
            (params) => ec2().revokeSecurityGroupIngress(params),
            eq(kind, "egress"),
            (params) => ec2().revokeSecurityGroupEgress(params),
            () => {
              assert(`invalid kind: '${kind}'`);
            },
          ]),
          (error, params) =>
            pipe([
              () => error,
              tap((params) => {
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
        () => removeTags({ name, GroupId: live.GroupId }),
        tap(() => {
          logger.debug(`destroyed sg rule ${JSON.stringify({ kind, name })}`);
        }),
      ])();

  return {
    findNamespace,
    configDefault,
    getList,
    getByName,
    findRuleInSecurityGroup,
    create,
    destroy,
    ec2,
  };
};

const cannotBeDeleted = pipe([
  get("live"),
  tap((params) => {
    assert(params.IpPermission);
  }),
  and([eq(get(`IpPermission.IpProtocol`), "-1"), pipe([get("Tags"), isEmpty])]),
]);

exports.AwsSecurityGroupRuleIngress = ({ spec, config }) => {
  const { getList, getByName, configDefault, create, destroy, findNamespace } =
    SecurityGroupRuleBase({
      config,
    });
  return {
    type: "SecurityGroupRuleIngress",
    spec,
    findId: findName({ kind: "ingress", config }),
    findName: findName({ kind: "ingress", config }),
    findDependencies,
    findNamespace,
    getByName,
    getList: getList({ property: "IpPermissions" }),
    create: create({
      kind: "ingress",
    }),
    destroy: destroy({
      kind: "ingress",
    }),
    configDefault,
    shouldRetryOnException,
    isDefault: cannotBeDeleted,
    cannotBeDeleted: cannotBeDeleted,
  };
};

exports.AwsSecurityGroupRuleEgress = ({ spec, config }) => {
  const { getList, getByName, configDefault, create, destroy, findNamespace } =
    SecurityGroupRuleBase({
      config,
    });

  return {
    spec,
    findDependencies,
    findNamespace,
    findId: findName({ kind: "egress", config }),
    findName: findName({ kind: "egress", config }),
    getByName,
    getList: getList({ property: "IpPermissionsEgress" }),
    create: create({
      kind: "egress",
    }),
    destroy: destroy({
      kind: "egress",
    }),
    configDefault,
    shouldRetryOnException,
    isDefault: cannotBeDeleted,
    cannotBeDeleted: cannotBeDeleted,
  };
};
