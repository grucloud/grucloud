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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamInstanceProfile = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = IAMNew(config);

  const findName = get("live.InstanceProfileName");
  const findId = get("live.Arn");

  const managedByOther = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(live.InstanceProfileName);
      }),
      () => live,
      get("InstanceProfileName"),
      callProp("startsWith", "eks-"),
      tap((params) => {
        assert(true);
      }),
    ])();

  const findDependencies = ({ live }) => [
    {
      type: "Role",
      group: "iam",
      ids: pipe([() => live, get("Roles"), pluck("Arn")])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#listInstanceProfiles-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.debug(`getList instance profile`);
      }),
      () => iam().listInstanceProfiles(params),
      get("InstanceProfiles"),
      tap((instanceProfiles) => {
        assert(instanceProfiles);
      }),
      map.pool(
        mapPoolSize,
        assign({
          Tags: pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["InstanceProfileName"]),
            iam().listInstanceProfileTags,
            get("Tags"),
          ]),
        })
      ),
      tap((instanceProfiles) => {
        logger.debug(`getList instanceProfiles: ${tos(instanceProfiles)}`);
      }),
      (instanceProfiles) => ({
        total: instanceProfiles.length,
        items: instanceProfiles,
      }),
      tap(({ total }) => {
        logger.debug(`getList #instanceProfile: ${total}`);
      }),
    ])();

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

  const create = async ({ name, payload = {}, dependencies }) =>
    pipe([
      tap(() => {
        logger.info(`create iam instance profile ${name}`);
        logger.debug(`payload: ${tos(payload)}`);
      }),
      () => defaultsDeep({})(payload),
      (createParams) => iam().createInstanceProfile(createParams),
      dependencies,
      get("iamRoles"),
      tap((iamRoles) => {
        assert(iamRoles, "missing dependency iamRoles");
        assert(Array.isArray(iamRoles), "iamRoles must be an array");
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
  const destroy = async ({ live }) =>
    pipe([
      () => findName({ live }),
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
    findNamespace: pipe([
      get("live.Roles"),
      tap((namespace) => {
        logger.info(`IamInstanceProfile ${namespace}`);
      }),
      first,
      switchCase([
        isEmpty,
        () => undefined,
        (live) => findNamespaceInTags(config)({ live }),
      ]),
      tap((namespace) => {
        logger.info(`IamInstanceProfile ${namespace}`);
      }),
    ]),
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
