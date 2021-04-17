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
const { defaultsDeep, isEmpty, find } = require("rubico/x");
const {
  Ec2New,
  shouldRetryOnException,
  buildTags,
  findNameInTags,
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

const getSecurityGroup = ({ name, dependencies = {} }) =>
  pipe([
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
        (securityGroup) => securityGroup.getLive(),
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

const addTags = ({ ec2, name, payload, securityGroup }) =>
  pipe([
    () => ({
      Resources: [findGroupId(securityGroup.live)],
      Tags: [
        {
          Key: name,
          Value: JSON.stringify(payload),
        },
      ],
    }),
    (params) => ec2().createTags(params),
  ])();

const removeTags = ({ ec2, name, securityGroup }) =>
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

const findDependencies = ({ live }) => [
  {
    type: "SecurityGroup",
    ids: [live.GroupId],
  },
];

const SecurityGroupRuleBase = ({ config }) => {
  const configDefault = async ({
    name,
    properties: { Tags, ...otherProps },
    dependencies,
  }) => {
    return defaultsDeep(otherProps)({});
  };

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
      get("Tags"),
      find(eq(get("Key"), name)),
      get("Value"),
      tryCatch(
        pipe([
          JSON.parse,
          (record) => ({
            ...record,
            Tags: buildTags({ name, config }),
            GroupId: securityGroup.GroupId,
          }),
        ]),
        () => undefined
      ),
      tap((rule) => {
        logger.debug(`findRuleInSecurityGroup ${name}: ${tos(rule)}`);
      }),
    ])();

  const getList = ({ resources = [] } = {}) =>
    pipe([
      tap(() => {
        logger.info(`list sg rule `);
      }),
      () => resources,
      map((resource) =>
        pipe([
          tap(() => {
            logger.debug(`getList secGroupRule resource ${resource.name}`);
          }),
          () => getSecurityGroup(resource),
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

  const getByName = async ({ name, dependencies }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
        assert(dependencies, "dependencies");
      }),
      () => getSecurityGroup({ dependencies, name }),
      switchCase([
        not(isEmpty),
        (securityGroup) => findRuleInSecurityGroup({ name, securityGroup }),
        () => {},
      ]),
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  return { configDefault, getList, getByName, findRuleInSecurityGroup };
};

exports.AwsSecurityGroupRuleIngress = ({ spec, config }) => {
  const ec2 = Ec2New(config);
  const { getList, getByName, configDefault } = SecurityGroupRuleBase({
    config,
  });

  const create = async ({
    payload,
    name,
    resolvedDependencies: { securityGroup },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create sg rule ingress ${tos({ name })}`);
        logger.debug(`sg rule payload ${tos(payload)}`);
        //assert(securityGroup, "missing securityGroup dependencies");
      }),
      () => ({
        GroupId: findGroupId(securityGroup.live),
        ...payload,
      }),
      (params) => ec2().authorizeSecurityGroupIngress(params),
      () => addTags({ ec2, name, payload, securityGroup }),
      tap(() => {
        logger.info(`created sg rule ingress ${tos({ name })}`);
      }),
    ])();

  const destroy = async ({ name, live, resource }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy sg rule ingress ${JSON.stringify({ name })}`);
      }),
      () => resource,
      getSecurityGroup,
      tap.if(isEmpty, () => {
        throw Error(`cannot find security group`);
      }),
      tap((securityGroup) =>
        ec2().revokeSecurityGroupIngress({
          GroupId: findGroupId(securityGroup),
          ...omit(["Tags"])(live),
        })
      ),
      (securityGroup) => removeTags({ ec2, name, securityGroup }),
      tap(() => {
        logger.debug(`destroyed sg rule ingress ${JSON.stringify({ name })}`);
      }),
    ])();

  return {
    type: "SecurityGroupRuleIngress",
    spec,
    findId,
    findDependencies,
    findName,
    getByName,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
exports.AwsSecurityGroupRuleEgress = ({ spec, config }) => {
  const ec2 = Ec2New(config);
  const { getList, getByName, configDefault } = SecurityGroupRuleBase({
    config,
  });
  const create = async ({
    payload,
    name,
    resolvedDependencies: { securityGroup },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create sg rule egress ${tos({ name })}`);
        logger.debug(`sg rule payload ${tos(payload)}`);
        assert(securityGroup, "missing securityGroup dependencies");
      }),
      () => ({
        GroupId: findGroupId(securityGroup.live),
        ...payload,
      }),
      (params) => ec2().authorizeSecurityGroupEgress(params),
      () => addTags({ ec2, name, payload, securityGroup }),
      tap(() => {
        logger.info(`created sg rule ${tos({ name })}`);
      }),
    ])();

  const destroy = async ({ name, live, resource }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy sg rule egress ${JSON.stringify({ name })}`);
      }),
      () => resource,
      getSecurityGroup,
      tap.if(isEmpty, () => {
        throw Error(`cannot find security group`);
      }),
      tap((securityGroup) =>
        ec2().revokeSecurityGroupEgress({
          GroupId: findGroupId(securityGroup),
          ...omit(["Tags"])(live),
        })
      ),
      (securityGroup) => removeTags({ ec2, name, securityGroup }),
      tap(() => {
        logger.debug(`destroyed sg rule egress ${JSON.stringify({ name })}`);
      }),
    ])();

  return {
    type: "SecurityGroupRuleEgress",
    spec,
    findId,
    findDependencies,
    findName,
    getByName,
    getList,
    create,
    destroy,
    configDefault,
    shouldRetryOnException,
  };
};
