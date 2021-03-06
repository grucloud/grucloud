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
  defaultsDeep,
  find,
  size,
  identity,
  isEmpty,
  last,
  first,
  keys,
} = require("rubico/x");
const moment = require("moment");
const logger = require("@grucloud/core/logger")({ prefix: "IamPolicy" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  IAMNew,
  buildTags,
  findNameInTagsOrId,
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
  const findName = (item) =>
    pipe([
      () => item,
      get("live.name"),
      switchCase([
        isEmpty,
        () => findNameInTagsOrId({ findId })(item),
        identity,
      ]),
      tap((name) => {
        logger.debug(`IamPolicy name: ${name}`);
      }),
    ])();

  const findNamespace = ({ live }) =>
    pipe([
      () => live,
      get("namespace"),
      switchCase([
        isEmpty,
        () => findNamespaceInTags(config)({ live }),
        identity,
      ]),
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
            ...properties(),
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
      (encoded) => querystring.decode(encoded),
      keys,
      first,
      tryCatch(JSON.parse, (error, document) => {
        logger.error(`${error}, ${document}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listPolicies-property
  const getList = async ({ params, resources } = {}) =>
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
      tap((policies) => {
        logger.debug(`getList policy all: ${tos(policies)}`);
      }),
      (policies) => ({
        total: policies.length,
        items: policies,
      }),
      tap(({ total }) => {
        logger.info(`getList #policies: ${total}`);
      }),
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
  const create = async ({ name, payload = {} }) =>
    pipe([
      tap(() => {
        logger.info(`create policy ${name}`);
        logger.debug(`payload: ${tos(payload)}`);
      }),
      () => ({
        ...payload,
        PolicyDocument: JSON.stringify(payload.PolicyDocument),
      }),
      (createParams) => iam().createPolicy(createParams),
      get("Policy"),
      tap((Policy) => {
        logger.debug(`created iam policy result ${tos({ name, Policy })}`);
        logger.info(`created iam policy ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deletePolicy-property
  const destroy = async ({ id, name }) =>
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
    cannotBeDeleted: pipe([
      tap((params) => {
        //TODO
        //assert(params.resource);
      }),
      get("resource.readOnly"),
    ]),
  };
};

exports.isOurMinionIamPolicy = (item) =>
  pipe([
    () => item,
    tap(({ resource }) => {
      //TODO
      //assert(resource);
    }),
    or([get("resource.readOnly"), isOurMinion]),
    tap((isOurMinion) => {
      logger.debug(`isOurMinionIamPolicy '${item.live.name}' ${isOurMinion}`);
    }),
  ])();
