const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  assign,
} = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "IamGroup" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
  mapPoolSize,
} = require("@grucloud/core/Common");
const {
  IAMNew,
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
} = require("../AwsCommon");

const findName = get("GroupName");
const findId = findName;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamGroup = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = IAMNew(config);

  const findDependencies = ({ live }) => [
    {
      type: "IamPolicy",
      ids: pipe([() => live, get("AttachedPolicies"), pluck("PolicyArn")])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listGroups-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList group ${tos(params)}`);
      }),
      () => iam().listGroups(params),
      get("Groups"),
      map.pool(
        mapPoolSize,
        tryCatch(
          assign({
            AttachedPolicies: pipe([
              ({ GroupName }) =>
                iam().listAttachedGroupPolicies({
                  GroupName,
                  MaxItems: 1e3,
                }),
              get("AttachedPolicies"),
            ]),
            Policies: pipe([
              ({ GroupName }) =>
                iam().listGroupPolicies({
                  GroupName,
                  MaxItems: 1e3,
                }),
              get("Policies"),
            ]),
          }),
          (error, group) =>
            pipe([
              tap(() => {
                logger.error(
                  `getList iam group error: ${tos({ error, group })}`
                );
              }),
              () => ({ error, group }),
            ])()
        )
      ),
      tap((groups) => {
        logger.debug(`getList groups: ${tos(groups)}`);
      }),
      (groups) => ({
        total: groups.length,
        items: groups,
      }),
      tap(({ total }) => {
        logger.info(`getList #groups: ${tos(total)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => iam().getGroup({ GroupName: id }),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createGroup-property

  const create = async ({
    name,
    payload = {},
    resolvedDependencies: { policies },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create iam group ${tos({ name, payload })}`);
      }),
      () => iam().createGroup(payload),
      get("Group"),
      tap.if(
        () => policies,
        () =>
          forEach(
            pipe([
              tap((policy) => {
                logger.info(`attachGroupPolicy ${tos({ policy })}`);
                assert(policy.live.Arn, `no live.Arn in ${tos(policy)}`);
              }),
              (policy) => ({
                PolicyArn: policy.live.Arn,
                GroupName: name,
              }),
              tap((params) => {
                logger.info(`attachGroupPolicy ${tos({ params })}`);
              }),
              (params) => iam().attachGroupPolicy(params),
            ])
          )(policies)
      ),
      tap((Group) => {
        logger.info(`created iam group ${tos({ name, Group })}`);
      }),
    ])();

  const removeUserFromGroup = ({ GroupName }) =>
    pipe([
      () =>
        iam().getGroup({
          GroupName,
          MaxItems: 1e3,
        }),
      get("Users"),
      tap((Users = []) => {
        logger.info(`removeUserFromGroup #users ${Users.length}`);
      }),
      forEach(({ UserName }) =>
        iam().removeUserFromGroup({
          GroupName,
          UserName,
        })
      ),
    ]);

  const detachGroupPolicy = ({ GroupName }) =>
    pipe([
      () => iam().listAttachedGroupPolicies({ GroupName, MaxItems: 1e3 }),
      get("AttachedPolicies"),
      forEach(({ PolicyArn }) => {
        iam().detachGroupPolicy({
          PolicyArn,
          GroupName,
        });
      }),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteGroup-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy iam group ${JSON.stringify({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      detachGroupPolicy({ GroupName: id }),
      removeUserFromGroup({ GroupName: id }),
      () =>
        iam().deleteGroup({
          GroupName: id,
        }),
      tap(() =>
        retryCall({
          name: `iam group isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroyed iam group, ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({ GroupName: name, Path: "/" })(properties);

  return {
    spec,
    findId,
    findDependencies,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
    shouldRetryOnExceptionDelete,
  };
};
// TODO use resources instead of resourceNames
exports.isOurMinionIamGroup = ({ live, resourceNames }) => {
  assert(live);
  assert(resourceNames, "resourceNames");
  const isOur = resourceNames.includes(live.GroupName);
  logger.debug(`isOurMinionIamGroup: ${isOur}`);
  return isOur;
};
