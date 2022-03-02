const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  not,
  eq,
} = require("rubico");
const { defaultsDeep, isEmpty } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "UserPool" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { findNamespaceInTagsObject, createEndpoint } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.Id");
const findName = get("live.Name");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.UserPool = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const cognitoIdentityServiceProvider = () =>
    createEndpoint({ endpointName: "CognitoIdentityServiceProvider" })(config);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listUserPools-property
  const getList = () =>
    pipe([
      tap(() => {
        logger.info(`getList UserPool`);
      }),
      () => ({ MaxResults: 10 }),
      cognitoIdentityServiceProvider().listUserPools,
      get("UserPools"),
      map(getById),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#describeUserPool-property
  const getById = ({ Id: UserPoolId }) =>
    pipe([
      tap(() => {
        logger.info(`getById UserPool: ${UserPoolId}`);
      }),
      tryCatch(
        pipe([
          () => ({ UserPoolId }),
          cognitoIdentityServiceProvider().describeUserPool,
          get("UserPool"),
        ]),
        switchCase([
          eq(get("code"), "ResourceNotFoundException"),
          () => {
            logger.debug(`getById ${UserPoolId} ResourceNotFoundException`);
          },
          (error) => {
            logger.debug(`getById error: ${tos(error)}`);
            throw error;
          },
        ])
      ),
      tap((result) => {
        logger.debug(`getById UserPool result: ${tos(result)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#describeCluster-property

  const isUpById = pipe([getById, not(isEmpty)]);
  const isDownById = pipe([getById, isEmpty]);

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPool-property
  const create = ({ name, payload, resolvedDependencies: {} }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create UserPool: ${name}, ${tos(payload)}`);
      }),
      () => payload,
      cognitoIdentityServiceProvider().createUserPool,
      get("UserPool"),
      ({ Id }) =>
        retryCall({
          name: `UserPool isUpById`,
          fn: () => isUpById({ Id }),
          config: { retryCount: 12 * 20, retryDelay: 5e3 },
        }),
      tap(() => {
        logger.info(`UserPool created: ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteUserPool-property
  const destroy = ({ name, live }) =>
    pipe([
      tap(() => {
        logger.info(`destroy UserPool ${name}`);
      }),
      () => ({ UserPoolId: live.Id }),
      tap(cognitoIdentityServiceProvider().deleteUserPool),
      tap(({ UserPoolId }) =>
        retryCall({
          name: `UserPool isDownById: ${name}`,
          fn: () => isDownById({ Id: UserPoolId }),
          config,
        })
      ),
      tap(() => {
        logger.info(`UserPool destroyed ${name}`);
      }),
    ])();

  const configDefault = ({ name, namespace, properties, dependencies: {} }) =>
    pipe([
      tap(() => {}),
      () => properties,
      defaultsDeep({
        PoolName: name,
        UserPoolTags: buildTagsObject({ config, namespace, name }),
      }),
    ])();

  return {
    spec,
    findId,
    findNamespace: findNamespaceInTagsObject(config),
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
  };
};
