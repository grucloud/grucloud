const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  not,
  assign,
  filter,
  omit,
  tryCatch,
  switchCase,
  pick,
  flatMap,
} = require("rubico");
const { pluck, defaultsDeep, size, append, isEmpty } = require("rubico/x");
const logger = require("@grucloud/core/logger")({
  prefix: "Method",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");

const {
  createEndpoint,
  shouldRetryOnException,
  tagsExtractFromDescription,
  tagsRemoveFromDescription,
} = require("../AwsCommon");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pick(["restApiId", "resourceId", "httpMethod"]);

exports.Method = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  const findId = ({ live, lives }) =>
    pipe([
      () =>
        lives.getById({
          id: live.resourceId,
          type: "Resource",
          group: "APIGateway",
          providerName: config.providerName,
        }),
      get("name"),
      tap((name) => {
        assert(name);
      }),
      append(`_${live.httpMethod}`),
      tap((params) => {
        assert(true);
      }),
    ])();

  const findName = (params) => {
    const fns = [get("live.operationName"), findId];
    for (fn of fns) {
      const name = fn(params);
      if (!isEmpty(name)) {
        return name;
      }
    }
    assert(false, "should have a name");
  };

  const findDependencies = ({ live, lives }) => [
    {
      type: "Resource",
      group: "APIGateway",
      ids: [live.resourceId],
    },
    {
      type: "Autorizer",
      group: "APIGateway",
      ids: [live.authorizerId], //TODO
    },
  ];

  const getById = client.getById({
    pickId,
    method: "getMethod",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getMethod-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList method`);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Resource",
          group: "APIGateway",
        }),
      pluck("live"),
      tap((params) => {
        assert(true);
      }),
      flatMap(({ restApiId, restApiName, id, path }) =>
        tryCatch(
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            map((httpMethod) =>
              tryCatch(
                pipe([
                  () => ({
                    restApiId,
                    resourceId: id,
                    httpMethod,
                  }),
                  apiGateway().getMethod,
                  defaultsDeep({ path }),
                  tap((params) => {
                    assert(true);
                  }),
                ]),
                (error) =>
                  pipe([
                    () => error,
                    switchCase([
                      eq(get("code"), "NotFoundException"),
                      () => undefined,
                      () => {
                        throw error;
                      },
                    ]),
                  ])()
              )()
            ),
            filter(not(isEmpty)),
            tap((params) => {
              assert(true);
            }),
            map(
              defaultsDeep({
                restApiId,
                restApiName,
                resourceId: id,
              })
            ),
            map(
              assign({
                tags: tagsExtractFromDescription,
                description: tagsRemoveFromDescription,
              })
            ),
          ]),
          (error) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => ({
                error,
              }),
            ])()
        )()
      ),
    ])();

  //const isUpByName = pipe([getByName, not(isEmpty)]);
  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#putMethod-property
  const create = ({ name, payload, resolvedDependencies: { restApi } }) =>
    pipe([
      tap(() => {
        logger.info(`create method: ${name}`);
        logger.debug(tos(payload));
      }),
      () => payload,
      apiGateway().putMethod,
      tap((params) => {
        logger.info(`created method ${name}`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update method: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      apiGateway().updateMethod,
      tap(() => {
        logger.info(`updated method ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteMethod-property
  const destroy = client.destroy({
    pickId,
    method: "deleteMethod",
    getById,
    ignoreErrorCodes: ["NotFoundException"],
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { resource, authorizer },
  }) =>
    pipe([
      tap(() => {
        assert(resource, "missing 'resource' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        restApiId: getField(resource, "restApiId"),
        resource: getField(resource, "id"),
        ...(authorizer && {
          authorizerId: getField(authorizer, "authorizerId"),
        }),
        tags: buildTagsObject({ name, namespace, config, userTags: Tags }),
      }),
    ])();

  return {
    spec,
    findName,
    getById,
    findId,
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
