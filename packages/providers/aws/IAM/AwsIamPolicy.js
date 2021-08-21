const assert = require("assert");
const querystring = require("querystring");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  filter,
  switchCase,
  fork,
  eq,
  assign,
  pick,
  or,
} = require("rubico");
const {
  includes,
  defaultsDeep,
  size,
  isEmpty,
  last,
  first,
  keys,
  when,
} = require("rubico/x");
const moment = require("moment");
const logger = require("@grucloud/core/logger")({ prefix: "IamPolicy" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  IAMNew,
  buildTags,
  findNamespaceInTags,
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
  isOurMinion,
} = require("../AwsCommon");
const {
  mapPoolSize,
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamPolicy = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = IAMNew(config);

  const findId = get("live.Arn");

  const findName = ({ live }) =>
    pipe([
      () => live,
      get("name"),
      when(isEmpty, () => live.PolicyName),
      tap((name) => {
        if (!name) {
          assert(name, `no name in ${JSON.stringify(live)}`);
        }
      }),
    ])();

  const findNamespace = ({ live }) =>
    pipe([
      () => live,
      get("namespace"),
      when(isEmpty, () => findNamespaceInTags(config)({ live })),
      tap((namespace) => {
        logger.debug(`findNamespace ${namespace}`);
      }),
    ])();

  const addTargets = ({ resources = [], policies } = {}) =>
    pipe([
      tap(() => {
        logger.info(
          `addTargets #policies: ${size(policies)}, #resources: ${size(
            resources
          )}`
        );
      }),
      () => resources,
      filter(get("readOnly")),
      map(
        pipe([
          ({ name, namespace, properties }) => ({
            name,
            ...(namespace && { namespace }),
            ...properties({ config }),
          }),
          assign({
            PolicyDocument: ({ Arn }) =>
              fetchPolicyDocument({ PolicyArn: Arn }),
          }),
        ])
      ),
      (readOnlyResources) => [...policies, ...readOnlyResources],
      tap((policiesAll) => {
        logger.info(`addTargets #policies  ${size(policiesAll)}`);
      }),
    ])();

  const fetchPolicyDocument = ({ PolicyArn }) =>
    pipe([
      tap(() => {
        assert(PolicyArn, "PolicyArn");
      }),
      () => iam().listPolicyVersions({ PolicyArn }),
      get("Versions"),
      tap((params) => {
        assert(true);
      }),
      last,
      ({ VersionId }) =>
        iam().getPolicyVersion({
          PolicyArn,
          VersionId,
        }),
      get("PolicyVersion.Document"),
      querystring.decode,
      keys,
      first,
      tryCatch(JSON.parse, (error, document) => {
        logger.error(`${error}, ${document}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listPolicies-property
  const getList = ({ params, resources } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList iam policy`);
      }),
      () => iam().listPolicies({ ...params, Scope: "Local", MaxItems: 1e3 }),
      tap(({ Policies }) => {
        logger.debug(`getList: ${Policies.length}`);
      }),
      get("Policies"),
      filter((policy) => moment(policy.CreateDate).isAfter("2020-09-11")),
      tap((policies) => {
        logger.debug(`getList: ${policies.length}`);
      }),
      map.pool(
        mapPoolSize,
        tryCatch(
          (policy) =>
            pipe([
              () => iam().getPolicy({ PolicyArn: policy.Arn }),
              get("Policy"),
              assign({
                PolicyDocument: () =>
                  fetchPolicyDocument({ PolicyArn: policy.Arn }),
                EntitiesForPolicy: pipe([
                  () =>
                    iam().listEntitiesForPolicy({
                      PolicyArn: policy.Arn,
                    }),
                  pick(["PolicyGroups", "PolicyUsers", "PolicyRoles"]),
                ]),
              }),
            ])(),
          (error, policy) =>
            pipe([
              tap(() => {
                logger.error(
                  `getList policy error: ${tos({
                    error,
                    policy,
                  })}`
                );
              }),
              () => ({ error, policy }),
            ])()
        )
      ),
      tap((policies) => {
        logger.debug(`getList policy managed: ${tos(policies)}`);
      }),
      (policies) => addTargets({ policies, resources }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => iam().getPolicy({ PolicyArn: id }),
      switchCase([
        eq(get("code"), "NoSuchEntity"),
        (error, { id }) => {
          logger.debug(`getById ${id} NoSuchEntity`);
        },
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw error;
        },
      ])
    ),
    tap((result) => {
      logger.debug(`getById result: ${result}`);
    }),
  ]);

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createPolicy-property
  const create = ({ name, payload = {} }) =>
    pipe([
      tap(() => {
        logger.info(`create policy ${name}`);
        logger.debug(`payload: ${tos(payload)}`);
      }),
      //TODO assign
      () => ({
        ...payload,
        PolicyDocument: JSON.stringify(payload.PolicyDocument),
      }),
      iam().createPolicy,
      get("Policy"),
      tap((Policy) => {
        logger.debug(`created iam policy result ${tos({ name, Policy })}`);
        logger.info(`created iam policy ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deletePolicy-property
  const destroy = ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy iam policy ${JSON.stringify({ name, id })}`);
      }),
      () =>
        iam().listEntitiesForPolicy({
          PolicyArn: id,
        }),
      tap((result) => {
        logger.debug(`destroy ${tos(result)}`);
      }),
      fork({
        PolicyUsers: pipe([
          get("PolicyUsers"),
          tap((policyUsers) => {
            logger.debug(`destroy detachUserPolicy ${tos(policyUsers)}`);
          }),
          map((policyUsers) =>
            iam().detachUserPolicy({
              PolicyArn: id,
              UserName: policyUsers.UserName,
            })
          ),
        ]),
        PolicyGroups: pipe([
          get("PolicyGroups"),
          tap((policyGroups) => {
            logger.debug(`destroy detachGroupPolicy ${tos(policyGroups)}`);
          }),
          map((policyGroup) =>
            iam().detachGroupPolicy({
              PolicyArn: id,
              GroupName: policyGroup.GroupName,
            })
          ),
        ]),
        PolicyRoles: pipe([
          get("PolicyRoles"),
          tap((policyRoles) => {
            logger.debug(`destroy detachRolePolicy ${tos(policyRoles)}`);
          }),
          map((policyRole) =>
            iam().detachRolePolicy({
              PolicyArn: id,
              RoleName: policyRole.RoleName,
            })
          ),
        ]),
      }),
      () =>
        iam().deletePolicy({
          PolicyArn: id,
        }),
      () =>
        retryCall({
          name: `iam policy isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        }),
      tap(() => {
        logger.info(`destroy iam policy done ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, namespace, properties, dependencies }) =>
    defaultsDeep({
      PolicyName: name,
      Tags: buildTags({ name, namespace, config }),
    })(properties);

  const cannotBeDeleted = ({ live }) =>
    pipe([
      tap(() => {
        assert(live);
      }),
      () => live,
      get("name"),
      tap((name) => {
        //assert(name);
      }),
      includes("Amazon"),
    ])();

  return {
    spec,
    findId,
    findNamespace,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
    shouldRetryOnExceptionDelete,
    managedByOther: cannotBeDeleted,
    cannotBeDeleted: cannotBeDeleted,
  };
};

exports.isOurMinionIamPolicy = (item) =>
  pipe([
    () => item,
    tap(({ live }) => {
      assert(live);
    }),
    or([get("resource.readOnly"), isOurMinion]),
    tap((isOurMinion) => {
      //logger.debug(`isOurMinionIamPolicy '${item.live.name}' ${isOurMinion}`);
    }),
  ])();
