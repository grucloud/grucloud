const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  eq,
  not,
  pick,
  assign,
  or,
} = require("rubico");
const {
  defaultsDeep,
  isEmpty,
  forEach,
  find,
  first,
  flatten,
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
const {
  mapPoolSize,
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const {
  IAMNew,
  buildTags,
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
  findNamespaceInTags,
  removeRoleFromInstanceProfile,
} = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamInstanceProfile = ({ spec, config }) => {
  const client = AwsClient({ spec, config });

  const iam = IAMNew(config);

  const findId = get("live.Arn");

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
  const getList = () =>
    pipe([
      () => ({}),
      iam().listInstanceProfiles,
      get("InstanceProfiles"),
      map.pool(
        mapPoolSize,
        assign({
          Tags: pipe([
            pick(["InstanceProfileName"]),
            iam().listInstanceProfileTags,
            get("Tags"),
          ]),
        })
      ),
    ])();

  //TODO getById should be getByName
  const getByName = getByNameCore({ getList, findName });

  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
    }),
    tryCatch(
      ({ id }) =>
        pipe([
          () => iam().getInstanceProfile({ InstanceProfileName: id }),
          get("InstanceProfile"),
        ])(),
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
      logger.debug(`getById result: ${tos(result)}`);
    }),
  ]);

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createInstanceProfile-property

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
          fn: () => getById({ id: name }),
          isExpectedResult: pipe([get("Roles"), not(isEmpty)]),
          config: { retryDelay: 2e3 },
        }),
      tap((instance) => {
        logger.info(`created iam instance profile  ${name}`);
        logger.debug(`created iam instance profile ${tos({ name, instance })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#deleteInstanceProfile-property
  const destroy = ({ live, lives }) =>
    pipe([
      () => findName({ live, lives }),
      (InstanceProfileName) =>
        pipe([
          tap(() => {
            logger.info(`destroy iam instance profile ${InstanceProfileName}`);
          }),
          tap(
            pipe([
              () => live.Roles,
              forEach(({ RoleName }) =>
                removeRoleFromInstanceProfile({ iam })({
                  RoleName,
                  InstanceProfileName,
                })
              ),
            ])
          ),
          tryCatch(
            pipe([
              () => iam().deleteInstanceProfile({ InstanceProfileName }),
              tap(() =>
                retryCall({
                  name: `iam instance profile isDownById id: ${InstanceProfileName}`,
                  fn: () => isDownById({ id: InstanceProfileName }),
                  config,
                })
              ),
            ]),
            switchCase([
              eq(get("code"), "NoSuchEntity"),
              () => undefined,
              (error) => {
                logger.error(`deleteInstanceProfile ${tos(error)}`);
                throw error;
              },
            ])
          ),
          tap(() => {
            logger.info(
              `destroy iam instance profile done, ${InstanceProfileName}`
            );
          }),
        ])(),
    ])();

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
            findNamespaceInTags(config),
          ])
        ),
      ])(),
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException,
    shouldRetryOnExceptionDelete,
    managedByOther,
  };
};
