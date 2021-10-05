const assert = require("assert");
const { map, pipe, tap, get, eq, tryCatch, flatMap } = require("rubico");
const { pluck, defaultsDeep } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "Authorizer",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.id");
const findName = get("live.name");
const pickId = ({ restApiId, id }) => ({ restApiId, authorizerId: id });

exports.Authorizer = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "RestApi",
      group: "APIGateway",
      ids: [live.restApiId],
    },
    // {
    //   type: "Function",
    //   group: "Lambda",
    //   ids: [live.providerARNs],
    // },
    {
      type: "UserPool",
      group: "Cognito",
      ids: [live.providerARNs],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getAuthorizer-property
  const getById = client.getById({
    pickId,
    method: "getAuthorizer",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getAuthorizers-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList authorizer`);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "RestApi",
          group: "APIGateway",
        }),
      pluck("live"),
      flatMap(({ id: restApiId, tags }) =>
        tryCatch(
          pipe([
            () => apiGateway().getAuthorizers({ restApiId }),
            get("items"),
            map(defaultsDeep({ restApiId, tags })),
          ]),
          (error) =>
            pipe([
              tap(() => {
                logger.error(`error getList authorizer ${tos({ error })}`);
              }),
              () => ({
                error,
              }),
            ])()
        )()
      ),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createAuthorizer-property
  const create = client.create({
    method: "createAuthorizer",
    pickId,
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateModel-property
  const update = client.update({
    pickId,
    method: "updateAuthorizer",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteAuthorizer-property
  const destroy = client.destroy({
    pickId,
    method: "deleteAuthorizer",
    getById,
    ignoreError: eq(get("code"), "NotFoundException"),
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { restApi },
  }) =>
    pipe([
      tap(() => {
        assert(restApi, "missing 'restApi' dependency");
      }),
      () => properties,
      defaultsDeep({
        name,
        restApiId: getField(restApi, "id"),
      }),
    ])();

  return {
    spec,
    findName,
    findId,
    getById,
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
    shouldRetryOnException,
    findDependencies,
  };
};
