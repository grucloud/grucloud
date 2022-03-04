const assert = require("assert");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  not,
  filter,
  flatMap,
  eq,
  pick,
} = require("rubico");
const { defaultsDeep, includes, size, isEmpty } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "IdentityProvider" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getField } = require("@grucloud/core/ProviderCommon");

const { findNamespaceInTagsObject } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createCognitoIdentityProvider,
} = require("./CognitoIdentityServiceProviderCommon");
const findId = get("ProviderName");
const findName = get("ProviderName");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.IdentityProvider = ({ spec, config }) => {
  const cognitoIdentityServiceProvider = createCognitoIdentityProvider(config);
  const client = AwsClient({ spec, config })(cognitoIdentityServiceProvider);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listIdentityProviders-property
  //TODO getList
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList IdentityProvider`);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "UserPool",
          group: "ApiGatewayV2",
        }),
      flatMap(({ live }) =>
        tryCatch(
          pipe([
            () => live,
            pick("UserPoolId"),
            () => ({ UserPoolId }),
            cognitoIdentityServiceProvider().listIdentityProviders,
            get("Providers"),
            map(
              assign({
                Tags: ({ ApiMappingId }) =>
                  pipe([
                    () =>
                      cognitoIdentityServiceProvider().getTags({
                        ResourceArn: domainNameArn({
                          config,
                          DomainName: live.DomainName,
                        }),
                      }),
                    get("Tags"),
                  ])(),
              })
            ),
          ]),
          (error) =>
            pipe([
              tap(() => {
                assert(true);
              }),
              () => ({
                error,
              }),
            ])()
        )()
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#describeIdentityProvider-property
  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName IdentityProvider: ${name}`);
      }),
      tryCatch(
        pipe([
          () =>
            cognitoIdentityServiceProvider().describeIdentityProvider({ name }),
          get("IdentityProvider"),
        ]),
        switchCase([
          eq(get("code"), "ResourceNotFoundException"),
          () => {
            logger.debug(`getByName ${name} ResourceNotFoundException`);
          },
          (error) => {
            logger.debug(`getByName error: ${tos(error)}`);
            throw error;
          },
        ])
      ),
      tap((result) => {
        logger.debug(`getByName cluster result: ${tos(result)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#describeCluster-property
  //const isInstanceUp = eq(get("status"), "ACTIVE");

  const isUpByName = pipe([getByName, not(isEmpty)]);
  const isDownByName = pipe([getByName, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createIdentityProvider-property
  //TODO create
  const create = ({ name, payload, resolvedDependencies: {} }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create cluster: ${name}, ${tos(payload)}`);
      }),
      () => payload,
      cognitoIdentityServiceProvider().createIdentityProvider,
      get("IdentityProvider"),
      ({ ProviderName, UserPoolId }) =>
        retryCall({
          name: `cluster IdentityProvider isUpByName`,
          fn: () => isUpByName({ ProviderName, UserPoolId }),
          config: { retryCount: 12 * 20, retryDelay: 5e3 },
        }),
      tap(() => {
        logger.info(`IdentityProvider created: ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteIdentityProvider-property
  const destroy = ({ name, live }) =>
    pipe([
      tap(() => {
        logger.info(`destroy IdentityProvider ${name}`);
      }),
      () => live,
      pick(["ProviderName", "UserPoolId"]),
      tap(cognitoIdentityServiceProvider().deleteIdentityProvider),
      tap(({ ProviderName, UserPoolId }) =>
        retryCall({
          name: `IdentityProvider isDownByName: ${name}`,
          fn: () => isDownByName({ ProviderName, UserPoolId }),
          config,
        })
      ),
      tap(() => {
        logger.info(`IdentityProvider destroyed ${name}`);
      }),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { userPool },
  }) =>
    pipe([
      tap(() => {
        assert(userPool, "missing 'userPool' dependency");
      }),
      () => properties,
      defaultsDeep({
        ProviderName: name,
        UserPoolId: getField(userPool, "UserPoolId"),
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
