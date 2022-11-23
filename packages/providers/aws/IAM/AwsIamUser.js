const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  assign,
  fork,
  pick,
  omit,
} = require("rubico");
const { defaultsDeep, forEach, pluck, size } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "IamUser" });
const {
  findNamespaceInTags,
  throwIfNotAwsError,
  buildTags,
} = require("../AwsCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const { AwsClient } = require("../AwsClient");
const {
  createIAM,
  tagResourceIam,
  untagResourceIam,
  assignAttachedPolicies,
  ignoreErrorCodes,
} = require("./AwsIamCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#tagUser-property
const tagResource = tagResourceIam({ field: "UserName", method: "tagUser" });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagUser-property
const untagResource = untagResourceIam({
  field: "UserName",
  method: "untagUser",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamUser = ({ spec, config }) => {
  const iam = createIAM(config);
  const client = AwsClient({ spec, config })(iam);

  const findId = () => get("Arn");
  const pickId = pick(["UserName"]);
  const findName = () => get("UserName");

  const fetchLoginProfile = tryCatch(
    pipe([pick(["UserName"]), iam().getLoginProfile, get("LoginProfile")]),
    throwIfNotAwsError("NoSuchEntityException")
  );

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
            pick(["UserName"]),
            defaultsDeep({ MaxItems: 1e3 }),
            iam().listAttachedUserPolicies,
            get("AttachedPolicies"),
          ]),
          Policies: pipe([
            pick(["UserName"]),
            defaultsDeep({ MaxItems: 1e3 }),
            iam().listUserPolicies,
            get("PolicyNames"),
          ]),
          Groups: pipe([
            pick(["UserName"]),
            iam().listGroupsForUser,
            get("Groups"),
            pluck("GroupName"),
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
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createUser-property
  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { policies = [], iamGroups = [] },
  }) =>
    pipe([
      () => ({}),
      assignAttachedPolicies({ policies }),
      assign({
        Groups: pipe([
          () => iamGroups,
          map(
            pipe([
              get("config.GroupName"),
              tap((GroupName) => {
                assert(GroupName);
              }),
            ])
          ),
        ]),
      }),
      defaultsDeep(otherProps),
      defaultsDeep({
        UserName: name,
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#addUserToGroup-property
  const addUserToGroup = ({ name }) =>
    pipe([
      forEach(
        pipe([
          (GroupName) => ({ GroupName, UserName: name }),
          iam().addUserToGroup,
        ])
      ),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#attachUserPolicy-property
  const attachUserPolicy = ({ name }) =>
    pipe([
      tap((params) => {
        assert(name);
      }),
      forEach(
        pipe([
          tap(({ PolicyArn }) => {
            assert(PolicyArn);
          }),
          pick(["PolicyArn"]),
          defaultsDeep({ UserName: name }),
          iam().attachUserPolicy,
        ])
      ),
    ]);

  const create = client.create({
    method: "createUser",
    pickId,
    getById,
    config,
    filterPayload: omit(["AttachedPolicies", "Groups"]),
    pickCreated: () => get("User"),
    postCreate: ({ name, payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        fork({
          groups: pipe([
            () => payload,
            get("Groups", []),
            addUserToGroup({ name }),
          ]),
          policies: pipe([
            () => payload,
            get("AttachedPolicies", []),
            attachUserPolicy({ name }),
          ]),
        }),
      ]),
  });

  const updateAttachedPolicies = ({ name, diff }) =>
    pipe([
      () => diff,
      get("liveDiff.added.AttachedPolicies", []),
      attachUserPolicy({ name }),
    ]);

  const update = async ({ name, diff }) =>
    pipe([updateAttachedPolicies({ name, diff })])();

  const destroyAccessKey =
    ({ endpoint }) =>
    ({ UserName }) =>
      pipe([
        () => endpoint().listAccessKeys({ UserName }),
        get("AccessKeyMetadata"),
        forEach(({ AccessKeyId }) => {
          endpoint().deleteAccessKey({
            AccessKeyId,
            UserName,
          });
        }),
      ])();

  const removeUserFromGroup =
    ({ endpoint }) =>
    ({ UserName }) =>
      pipe([
        tap((params) => {
          assert(UserName);
        }),
        () => ({ UserName }),
        endpoint().listGroupsForUser,
        get("Groups"),
        tap((Groups = []) => {
          logger.debug(`removeUserFromGroup: ${size(Groups)}`);
        }),
        forEach(({ GroupName }) => {
          endpoint().removeUserFromGroup({
            GroupName,
            UserName,
          });
        }),
      ])();

  const detachUserPolicy =
    ({ endpoint }) =>
    ({ UserName }) =>
      pipe([
        () => ({ UserName, MaxItems: 1e3 }),
        endpoint().listAttachedUserPolicies,
        get("AttachedPolicies"),
        tap((AttachedPolicies = []) => {
          logger.debug(`detachUserPolicy: ${AttachedPolicies.length}`);
        }),
        forEach(({ PolicyArn }) => {
          endpoint().detachUserPolicy({
            PolicyArn,
            UserName,
          });
        }),
      ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteUserPolicy-property
  const deleteUserPolicy =
    ({ endpoint }) =>
    ({ UserName }) =>
      pipe([
        () => ({ UserName, MaxItems: 1e3 }),
        endpoint().listUserPolicies,
        get("PolicyNames"),
        tap((PolicyNames = []) => {
          logger.debug(`deleteUserPolicy: ${PolicyNames.length}`);
        }),
        forEach((PolicyName) => {
          endpoint().deleteUserPolicy({
            PolicyName,
            UserName,
          });
        }),
      ])();

  const deleteLoginProfile =
    ({ endpoint }) =>
    ({ UserName }) =>
      tryCatch(
        pipe([() => ({ UserName }), endpoint().deleteLoginProfile]),
        throwIfNotAwsError("NoSuchEntityException")
      )();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteUser-property
  const destroy = client.destroy({
    pickId,
    preDestroy: ({ endpoint }) =>
      pipe([
        pick(["UserName"]),
        fork({
          userFromGroup: removeUserFromGroup({ endpoint }),
          deletePolicy: pipe([
            tap(detachUserPolicy({ endpoint })),
            deleteUserPolicy({ endpoint }),
          ]),
          loginProfile: deleteLoginProfile({ endpoint }),
          accessKey: destroyAccessKey({ endpoint }),
        }),
      ]),
    method: "deleteUser",
    ignoreErrorCodes,
    getById,
    config,
  });

  return {
    spec,
    findId,
    getByName,
    getById,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    findNamespace: findNamespaceInTags,
    tagResource: tagResource({ iam }),
    untagResource: untagResource({ iam }),
  };
};
