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
const { defaultsDeep, isEmpty, forEach, pluck, find } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "IamUser" });
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const {
  IAMNew,
  buildTags,
  findNameInTags,
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
} = require("../AwsCommon");
const {
  mapPoolSize,
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("../../Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamUser = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = IAMNew(config);

  const findName = findNameInTags;
  const findId = get("UserName");

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listUsers-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList iam user`);
      }),
      () => iam().listUsers(params),
      get("Users"),
      tap((users) => {
        logger.debug(`getList users: ${tos(users)}`);
      }),
      map.pool(
        mapPoolSize,
        tryCatch(
          assign({
            AttachedPolicies: pipe([
              ({ UserName }) =>
                iam().listAttachedUserPolicies({
                  UserName,
                  MaxItems: 1e3,
                }),
              get("AttachedPolicies"),
              pluck("PolicyName"),
            ]),
            Policies: pipe([
              ({ UserName }) =>
                iam().listUserPolicies({
                  UserName,
                  MaxItems: 1e3,
                }),
              get("Policies"),
              pluck("PolicyName"),
            ]),
            Groups: pipe([
              ({ UserName }) => iam().listGroupsForUser({ UserName }),
              get("Groups"),
              pluck("GroupName"),
            ]),
            Tags: pipe([
              ({ UserName }) => iam().listUserTags({ UserName }),
              get("Tags"),
            ]),
          }),
          (error, user) =>
            pipe([
              tap(() => {
                logger.error(`getList iam user error: ${tos({ error, user })}`);
              }),
              () => ({ error, user }),
            ])()
        )
      ),
      tap.if(find(get("error")), (users) => {
        throw users;
      }),
      tap((users) => {
        logger.debug(`getList iam user results: ${tos(users)}`);
      }),
      (users) => ({
        total: users.length,
        items: users,
      }),
      tap(({ total }) => {
        logger.info(`getList #iamuser: ${total}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) => iam().getUser({ UserName: id }),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createUser-property

  const create = async ({ name, payload = {}, dependencies: { iamGroups } }) =>
    pipe([
      tap(() => {
        logger.info(`create iam user ${name}`);
        logger.debug(`payload: ${tos(payload)}`);
      }),
      () => defaultsDeep({ Tags: buildTags({ name, config }) })(payload),
      (createParams) => iam().createUser(createParams),
      get("User"),
      tap.if(
        () => iamGroups,
        () =>
          forEach((group) =>
            iam().addUserToGroup({ GroupName: group.name, UserName: name })
          )(iamGroups)
      ),
      tap((User) => {
        logger.debug(`created iam user result ${tos({ name, User })}`);
        logger.info(`created iam user ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteUser-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy iam user ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () => iam().listGroupsForUser({ UserName: id }),
      get("Groups"),
      tap((Groups = []) => {
        logger.debug(`destroy iam user Groups: ${Groups.length}`);
      }),
      forEach((group) => {
        iam().removeUserFromGroup({
          GroupName: group.GroupName,
          UserName: id,
        });
      }),
      () => iam().listAttachedUserPolicies({ UserName: id, MaxItems: 1e3 }),
      get("AttachedPolicies"),
      tap((AttachedPolicies = []) => {
        logger.debug(
          `destroy iam user AttachedPolicies: ${AttachedPolicies.length}`
        );
      }),
      forEach((policy) => {
        iam().detachUserPolicy({
          PolicyArn: policy.PolicyArn,
          UserName: id,
        });
      }),
      () => iam().listUserPolicies({ UserName: id, MaxItems: 1e3 }),
      get("PolicyNames"),
      tap((PolicyNames = []) => {
        logger.debug(`destroy iam user PolicyNames: ${PolicyNames.length}`);
      }),
      forEach((policyName) => {
        iam().deleteUserPolicy({
          PolicyName: policyName,
          UserName: id,
        });
      }),
      () =>
        iam().deleteUser({
          UserName: id,
        }),
      tap(() =>
        retryCall({
          name: `iam user isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroy iam user done, ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({ UserName: name, Path: "/" })(properties);

  return {
    type: "IamUser",
    spec,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
    shouldRetryOnExceptionDelete,
  };
};
