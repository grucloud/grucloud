const assert = require("assert");
const { map, pipe, tap, get, eq, not, pick, assign, or } = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  forEach,
  find,
  first,
  pluck,
  callProp,
  unless,
  prepend,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "IamInstanceProfile",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const {
  buildTags,
  findNamespaceInTags,
  removeRoleFromInstanceProfile,
} = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");
const {
  createIAM,
  tagResourceIam,
  untagResourceIam,
} = require("./AwsIamCommon");

//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#tagInstanceProfile-property
const tagResource = tagResourceIam({
  field: "InstanceProfileName",
  method: "tagInstanceProfile",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagInstanceProfile-property
const untagResource = untagResourceIam({
  field: "InstanceProfileName",
  method: "untagInstanceProfile",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamInstanceProfile = ({ spec, config }) => {
  const iam = createIAM(config);
  const client = AwsClient({ spec, config })(iam);

  const findId = get("live.Arn");
  const pickId = pick(["InstanceProfileName"]);

  const findNameEks = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(live.InstanceProfileName);
      }),
      () =>
        lives.getByType({
          type: "LaunchTemplate",
          group: "EC2",
          providerName: config.providerName,
        }),
      find(eq(get("live.LaunchTemplateName"), live.InstanceProfileName)),
      get("name"),
      unless(isEmpty, prepend("instance-profile-")),
    ])();

  const findName = (params) => {
    const fns = [findNameEks, get("live.InstanceProfileName")];
    for (fn of fns) {
      const name = fn(params);
      if (!isEmpty(name)) {
        return name;
      }
    }
  };

  const managedByOther = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(live.InstanceProfileName);
      }),
      () => live,
      get("InstanceProfileName"),
      or([callProp("startsWith", "eks-")]),
      tap((params) => {
        assert(true);
      }),
    ])();

  const findDependencies = ({ live }) => [
    {
      type: "Role",
      group: "IAM",
      ids: pipe([() => live, get("Roles"), pluck("Arn")])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listInstanceProfiles-property
  const getList = client.getList({
    method: "listInstanceProfiles",
    getParam: "InstanceProfiles",
    decorate: () =>
      pipe([
        assign({
          Tags: pipe([
            pick(["InstanceProfileName"]),
            iam().listInstanceProfileTags,
            get("Tags"),
          ]),
        }),
      ]),
  });

  //TODO getById should be getByName
  const getByName = getByNameCore({ getList, findName });

  const getById = client.getById({
    pickId,
    method: "getInstanceProfile",
    getField: "InstanceProfile",
    ignoreErrorCodes: ["NoSuchEntity"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createInstanceProfile-property
  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        InstanceProfileName: name,
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
    ])();

  const create = ({ name, payload = {}, dependencies }) =>
    pipe([
      tap(() => {
        logger.info(`create iam instance profile ${name}`);
        logger.debug(`payload: ${tos(payload)}`);
      }),
      () => payload,
      iam().createInstanceProfile,
      dependencies,
      get("roles"),
      tap((roles) => {
        assert(roles, "missing dependency roles");
        assert(Array.isArray(roles), "roles must be an array");
      }),
      forEach((iamRole) =>
        iam().addRoleToInstanceProfile({
          InstanceProfileName: name,
          RoleName: iamRole.name,
        })
      ),
      () =>
        retryCall({
          name: `create instance profile, getById: ${name}`,
          fn: pipe([() => ({ InstanceProfileName: name }), getById({})]),
          isExpectedResult: pipe([get("Roles"), not(isEmpty)]),
          config: { retryDelay: 2e3 },
        }),
      tap((instance) => {
        logger.info(`created iam instance profile  ${name}`);
        logger.debug(`created iam instance profile ${tos({ name, instance })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteInstanceProfile-property
  const destroy = client.destroy({
    pickId,
    preDestroy: ({ live }) =>
      pipe([
        () => live,
        ({ Roles, InstanceProfileName }) =>
          pipe([
            () => Roles,
            forEach(({ RoleName }) =>
              removeRoleFromInstanceProfile({ iam })({
                RoleName,
                InstanceProfileName,
              })
            ),
          ])(),
      ])(),
    method: "deleteInstanceProfile",
    ignoreErrorCodes: ["NoSuchEntity"],
    getById,
  });

  return {
    spec,
    findId,
    findDependencies,
    findNamespace: ({ live, lives }) =>
      pipe([
        () => live,
        get("Roles"),
        tap((roles) => {
          logger.info(`IamInstanceProfile ${roles}`);
        }),
        first,
        unless(
          isEmpty,
          pipe([
            ({ RoleName }) =>
              lives.getByName({
                name: RoleName,
                type: "Role",
                group: "IAM",
                providerName: config.providerName,
              }),
            unless(isEmpty, findNamespaceInTags(config)),
          ])
        ),
      ])(),
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    managedByOther,
    tagResource: tagResource({ iam }),
    untagResource: untagResource({ iam }),
  };
};
