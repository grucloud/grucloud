const assert = require("assert");
const {
  get,
  pipe,
  map,
  eq,
  tap,
  filter,
  not,
  omit,
  switchCase,
  tryCatch,
} = require("rubico");
const { defaultsDeep, isEmpty, isFunction } = require("rubico/x");
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

const findName = pipe([
  findNameInTags,
  tap((name) => {
    assert(true);
  }),
]);
const findId = findName;

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
            Key: name,
            Value: JSON.stringify(payload),
          },
          {
            Key: buildKeyNamespace({ name }),
            Value: namespace,
          },
        ],
      }),
      (params) => ec2().createTags(params),
    ])();

  const removeTags = ({ name, securityGroup }) =>
    pipe([
      () => ({
        Resources: [findGroupId(securityGroup)],
        Tags: [
          {
            Key: name,
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
      findValueInTags({ key: name }),
      tryCatch(
        pipe([
          JSON.parse,
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
        () => undefined
      ),
      tap((rule) => {
        logger.debug(`findRuleInSecurityGroup ${name}: ${tos(rule)}`);
      }),
    ])();

  const getList = ({ resources = [], lives } = {}) =>
    pipe([
      tap(() => {
        logger.info(`list sg rule `);
        assert(lives);
      }),
      () => resources,
      map((resource) =>
        pipe([
          tap(() => {
            logger.debug(`getList secGroupRule resource ${resource.name}`);
          }),
          () => getSecurityGroup({ resource, lives }),
          switchCase([
            isEmpty,
            () => null,
            (securityGroup) =>
              findRuleInSecurityGroup({ name: resource.name, securityGroup }),
          ]),
        ])()
      ),
      filter(not(isEmpty)),
      tap((items) => {
        logger.debug(`getList secGroupRule result: ${tos(items)}`);
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
    async ({
      payload,
      name,
      namespace,
      resolvedDependencies: { securityGroup },
    }) =>
      pipe([
        tap(() => {
          logger.info(
            `create sg rule ${JSON.stringify({ kind, name, namespace })}`
          );
          logger.debug(`${tos(payload)}`);
        }),
        () => ({
          GroupId: findGroupId(securityGroup.live),
          ...payload,
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
          assert(lives);
          logger.info(`destroy sg rule ${kind} ${name}`);
          logger.debug(`${kind} ${name}: ${JSON.stringify(live)}`);
        }),
        () => getSecurityGroup({ resource, lives }),
        tap.if(isEmpty, () => {
          throw Error(`cannot find security group ${kind}`);
        }),
        (securityGroup) =>
          pipe([
            () => ({
              GroupId: findGroupId(securityGroup),
              ...omit(["Tags"])(live),
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
              tap.if(
                not(eq(get("code"), "InvalidPermission.NotFound")),
                (error) => {
                  throw error;
                }
              )
            ),
            () => removeTags({ name, securityGroup }),
          ])(),
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

exports.AwsSecurityGroupRuleIngress = ({ spec, config }) => {
  const { getList, getByName, configDefault, create, destroy, findNamespace } =
    SecurityGroupRuleBase({
      config,
    });

  return {
    type: "SecurityGroupRuleIngress",
    spec,
    findId,
    findDependencies,
    findNamespace,
    findName,
    getByName,
    getList,
    create: create({
      kind: "ingress",
    }),
    destroy: destroy({
      kind: "ingress",
    }),
    configDefault,
    shouldRetryOnException,
  };
};
exports.AwsSecurityGroupRuleEgress = ({ spec, config }) => {
  const { getList, getByName, configDefault, create, destroy, findNamespace } =
    SecurityGroupRuleBase({
      config,
    });

  return {
    spec,
    findId,
    findDependencies,
    findNamespace,
    findName,
    getByName,
    getList,
    create: create({
      kind: "egress",
    }),
    destroy: destroy({
      kind: "egress",
    }),
    configDefault,
    shouldRetryOnException,
  };
};
