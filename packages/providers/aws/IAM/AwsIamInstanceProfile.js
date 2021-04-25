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
  and,
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
  shouldRetryOnException,
  shouldRetryOnExceptionDelete,
  findNamespaceInTags,
} = require("../AwsCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html
exports.AwsIamInstanceProfile = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const iam = IAMNew(config);

  const findName = get("InstanceProfileName");
  const findId = get("Arn");

  const findDependencies = ({ live }) => [
    {
      type: "IamRole",
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
          Roles: pipe([
            get("Roles"),
            map(
              tryCatch(
                assign({
                  Tags: pipe([
                    ({ RoleName }) => iam().listRoleTags({ RoleName }),
                    get("Tags"),
                  ]),
                }),
                (error, instanceProfile) =>
                  pipe([
                    tap((instanceProfile) => {
                      logger.error(
                        `getList instance profile error: ${tos({
                          error,
                          instanceProfile,
                        })}`
                      );
                    }),
                    () => ({ error, instanceProfile }),
                  ])()
              )
            ),
          ]),
        })
      ),
      tap.if(
        pipe([pluck(["Roles"]), flatten, find(get("error"))]),
        (instanceProfiles) => {
          throw instanceProfiles;
        }
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

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

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

  const create = async ({ name, payload = {}, dependencies: { iamRoles } }) =>
    pipe([
      tap(() => {
        logger.info(`create iam instance profile ${name}`);
        logger.debug(`payload: ${tos(payload)}`);
        assert(iamRoles, "missing dependency iamRoles");
        assert(Array.isArray(iamRoles), "iamRoles must be an array");
      }),
      () => defaultsDeep({})(payload),
      (createParams) => iam().createInstanceProfile(createParams),
      get("InstanceProfile"),
      tap(() =>
        forEach((iamRole) =>
          iam().addRoleToInstanceProfile({
            InstanceProfileName: name,
            RoleName: iamRole.name,
          })
        )(iamRoles)
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
      () => findName(live),
      (InstanceProfileName) =>
        pipe([
          tap(() => {
            logger.info(`destroy iam instance profile ${InstanceProfileName}`);
          }),
          tap(
            pipe([
              () => live.Roles,
              forEach(
                tryCatch(
                  ({ RoleName }) =>
                    iam().removeRoleFromInstanceProfile({
                      InstanceProfileName,
                      RoleName,
                    }),
                  tap.if(not(eq(get("code"), "NoSuchEntity")), (error) => {
                    logger.error(`removeRoleFromInstanceProfile ${tos(error)}`);
                    throw error;
                  })
                )
              ),
            ])
          ),
          tap(() => iam().deleteInstanceProfile({ InstanceProfileName })),
          tap(() =>
            retryCall({
              name: `iam instance profile isDownById id: ${InstanceProfileName}`,
              fn: () => isDownById({ id: InstanceProfileName }),
              config,
            })
          ),
          tap(() => {
            logger.info(
              `destroy iam instance profile done, ${InstanceProfileName}`
            );
          }),
        ])(),
    ])();

  const configDefault = ({ name, properties, dependencies }) =>
    defaultsDeep({ InstanceProfileName: name })(properties);

  return {
    type: "IamInstanceProfile",
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
  };
};
exports.isOurMinionInstanceProfile = ({ live, config: { projectName } }) =>
  pipe([
    () => live,
    get("Roles"),
    first,
    get("Tags"),
    find(
      and([
        //TODO use common function
        eq(get("Key"), "projectName"),
        eq(get("Value"), projectName),
      ])
    ),
    tap((minion) => {
      logger.debug(`isOurMinion ${minion} ${tos({ projectName })}`);
    }),
  ])();
