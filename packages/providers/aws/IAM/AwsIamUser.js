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
  pick,
} = require("rubico");
const { defaultsDeep, forEach, pluck, find } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "IamUser" });
const { tos } = require("@grucloud/core/tos");
const {
  IAMNew,
  buildTags,
  findNameInTagsOrId,
  findNamespaceInTags,
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
} = require("../AwsCommon");
const { mapPoolSize, getByNameCore } = require("@grucloud/core/Common");

const { AwsClient } = require("../AwsClient");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamUser = ({ spec, config }) => {
  const client = AwsClient({ spec, config });

  const iam = IAMNew(config);

  const findId = get("live.UserName");
  const pickId = pick(["UserName"]);
  const findName = findNameInTagsOrId({ findId });

  const findDependencies = ({ live }) => [
    {
      type: "Policy",
      group: "IAM",
      ids: pipe([() => live, get("AttachedPolicies"), pluck("PolicyArn")])(),
    },
    {
      type: "Group",
      group: "IAM",
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
  const getList = client.getList({
    method: "listUsers",
    getParam: "Users",
    decorate: () =>
      pipe([
        pick(["UserName"]),
        iam().getUser,
        get("User"),
        assign({
          AttachedPolicies: pipe([
            ({ UserName }) => ({
              UserName,
              MaxItems: 1e3,
            }),
            iam().listAttachedUserPolicies,
            get("AttachedPolicies"),
          ]),
          Policies: pipe([
            ({ UserName }) => ({
              UserName,
              MaxItems: 1e3,
            }),
            iam().listUserPolicies,
            get("Policies"),
          ]),
          Groups: pipe([
            pick(["UserName"]),
            iam().listGroupsForUser,
            get("Groups"),
          ]),
          AccessKeys: pipe([
            pick(["UserName"]),
            iam().listAccessKeys,
            get("AccessKeyMetadata"),
          ]),
          LoginProfile: fetchLoginProfile,
          Tags: pipe([pick(["UserName"]), iam().listUserTags, get("Tags")]),
        }),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId,
    method: "getUser",
    ignoreErrorCodes: ["NoSuchEntity"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createUser-property
  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        UserName: name,
        Path: "/",
        // Tags: buildTags({
        //   name,
        //   config,
        //   namespace,
        //   UserTags: Tags,
        // }),
      }),
    ])();

  const create = client.create({
    method: "createUser",
    pickId,
    getById,
    config,
    pickCreated: () => pipe([get("User")]),
    postCreate: ({ name, resolvedDependencies: { policies, iamGroups } }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
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
      ]),
  });

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

  const destroy = client.destroy({
    pickId,
    preDestroy: pipe([
      get("live"),
      pick(["UserName"]),
      fork({
        userFromGroup: removeUserFromGroup,
        deletePolicy: pipe([tap(detachUserPolicy), deleteUserPolicy]),
        loginProfile: deleteLoginProfile,
        accessKey: destroyAccessKey,
      }),
    ]),
    method: "deleteUser",
    ignoreErrorCodes: ["NoSuchEntity"],
    getById,
    config,
  });

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
