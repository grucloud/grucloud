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
  fork,
  not,
} = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck, find } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "IamUser" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  IAMNew,
  buildTags,
  findNameInTagsOrId,
  findNamespaceInTags,
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
} = require("../AwsCommon");
const {
  mapPoolSize,
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamUser = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = IAMNew(config);

  const findId = get("live.UserName");
  const findName = findNameInTagsOrId({ findId });

  const findDependencies = ({ live }) => [
    {
      type: "Policy",
      ids: pipe([() => live, get("AttachedPolicies"), pluck("PolicyArn")])(),
    },
    {
      type: "Group",
      ids: pipe([() => live, get("Groups"), pluck("GroupName")])(),
    },
  ];

  const fetchLoginProfile = ({ UserName }) =>
    tryCatch(
      pipe([() => iam().getLoginProfile({ UserName }), get("LoginProfile")]),
      switchCase([
        eq(get("code"), "NoSuchEntity"),
        () => undefined,
        (error) => {
          throw error;
        },
      ])
    )();

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
          pipe([
            ({ UserName }) =>
              iam().getUser({
                UserName,
              }),
            get("User"),
            assign({
              AttachedPolicies: pipe([
                ({ UserName }) =>
                  iam().listAttachedUserPolicies({
                    UserName,
                    MaxItems: 1e3,
                  }),
                get("AttachedPolicies"),
              ]),
              Policies: pipe([
                ({ UserName }) =>
                  iam().listUserPolicies({
                    UserName,
                    MaxItems: 1e3,
                  }),
                get("Policies"),
              ]),
              Groups: pipe([
                ({ UserName }) => iam().listGroupsForUser({ UserName }),
                get("Groups"),
              ]),
              AccessKeys: pipe([
                ({ UserName }) => iam().listAccessKeys({ UserName }),
                get("AccessKeyMetadata"),
              ]),
              LoginProfile: fetchLoginProfile,
              Tags: pipe([
                ({ UserName }) => iam().listUserTags({ UserName }),
                get("Tags"),
              ]),
            }),
          ]),
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

  const getByName = getByNameCore({ getList, findName });

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

  //const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createUser-property

  const create = async ({
    name,
    payload = {},
    resolvedDependencies: { iamGroups, policies },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create iam user ${name}`);
        logger.debug(`${name} => ${tos(payload)}`);
      }),
      () => iam().createUser(payload),
      get("User"),
      tap.if(
        () => iamGroups,
        () =>
          forEach((group) =>
            iam().addUserToGroup({
              GroupName: group.live.GroupName,
              UserName: name,
            })
          )(iamGroups)
      ),
      tap.if(
        () => policies,
        () =>
          forEach(
            pipe([
              tap((policy) => {
                logger.debug(`attachUserPolicy: ${tos(policy)}`);
                assert(policy.live.Arn);
              }),
              (policy) =>
                iam().attachUserPolicy({
                  PolicyArn: policy.live.Arn,
                  UserName: name,
                }),
            ])
          )(policies)
      ),
      tap((User) => {
        logger.debug(`created iam user result ${tos({ name, User })}`);
        logger.info(`created iam user ${name}`);
      }),
    ])();

  const destroyAccessKey = ({ UserName }) =>
    pipe([
      () => iam().listAccessKeys({ UserName }),
      get("AccessKeyMetadata"),
      forEach(({ AccessKeyId }) => {
        iam().deleteAccessKey({
          AccessKeyId,
          UserName,
        });
      }),
    ])();

  const removeUserFromGroup = ({ UserName }) =>
    pipe([
      () => iam().listGroupsForUser({ UserName }),
      get("Groups"),
      tap((Groups = []) => {
        logger.debug(`removeUserFromGroup: ${Groups.length}`);
      }),
      forEach(({ GroupName }) => {
        iam().removeUserFromGroup({
          GroupName,
          UserName,
        });
      }),
    ])();

  const detachUserPolicy = ({ UserName }) =>
    pipe([
      () => iam().listAttachedUserPolicies({ UserName, MaxItems: 1e3 }),
      get("AttachedPolicies"),
      tap((AttachedPolicies = []) => {
        logger.debug(`detachUserPolicy: ${AttachedPolicies.length}`);
      }),
      forEach(({ PolicyArn }) => {
        iam().detachUserPolicy({
          PolicyArn,
          UserName,
        });
      }),
    ])();

  const deleteUserPolicy = ({ UserName }) =>
    pipe([
      () => iam().listUserPolicies({ UserName, MaxItems: 1e3 }),
      get("PolicyNames"),
      tap((PolicyNames = []) => {
        logger.debug(`deleteUserPolicy: ${PolicyNames.length}`);
      }),
      forEach((PolicyName) => {
        iam().deleteUserPolicy({
          PolicyName,
          UserName,
        });
      }),
    ])();

  const deleteLoginProfile = ({ UserName }) =>
    tryCatch(
      pipe([() => iam().deleteLoginProfile({ UserName })]),
      tap.if(not(eq(get("code"), "NoSuchEntity")), (error) => {
        throw error;
      })
    )();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteUser-property
  const destroy = async ({ id: UserName, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy iam user ${JSON.stringify({ name, UserName })}`);
      }),
      fork({
        userFromGroup: () => removeUserFromGroup({ UserName }),
        deletePolicy: pipe([
          () => detachUserPolicy({ UserName }),
          () => deleteUserPolicy({ UserName }),
        ]),
        loginProfile: () => deleteLoginProfile({ UserName }),
        accessKey: () => destroyAccessKey({ UserName }),
      }),
      () =>
        iam().deleteUser({
          UserName,
        }),
      tap(() =>
        retryCall({
          name: `iam user isDownById: UserName: ${UserName}`,
          fn: () => isDownById({ id: UserName }),
          config,
        })
      ),
      tap(() => {
        logger.info(`destroy iam user done, ${JSON.stringify({ UserName })}`);
      }),
    ])();

  const configDefault = async ({ name, namespace, properties, dependencies }) =>
    defaultsDeep({
      UserName: name,
      Path: "/",
      Tags: buildTags({ name, namespace, config }),
    })(properties);

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
    findNamespace: findNamespaceInTags(config),
  };
};
