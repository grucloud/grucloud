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
const { pluck, defaultsDeep, size } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "Authorizer",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.id");
const findName = get("live.Name");
const pickParam = ({ restApiId, id }) => ({ restApiId, authorizerId: id });

const buildTagKey = ({ id }) => `gc-autorizer-${id}`;

const restApiArn = ({ config, restApiId }) =>
  `arn:aws:apigateway:${config.region}::/restapis/${restApiId}`;

exports.Authorizer = ({ spec, config }) => {
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "RestApi",
      group: "apiGateway",
      ids: [live.restApiId],
    },
  ];

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
          group: "apiGateway",
        }),
      pluck("id"),
      flatMap((restApiId) =>
        tryCatch(
          pipe([
            () => apiGateway().getAuthorizers({ restApiId }),
            get("items"),
            map(defaultsDeep({ restApiId })),
            map(
              assign({
                tags: ({ id }) =>
                  pipe([
                    () =>
                      apiGateway().getTags({
                        ResourceArn: restApiArn({
                          config,
                          restApiId,
                        }),
                      }),
                    get("tags"),
                    assign({ Name: get(buildTagKey({ id })) }),
                    omit([buildTagKey({ id })]),
                  ])(),
              })
            ),
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
      (items = []) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList authorizer #total: ${total}`);
      }),
    ])();

  //const isUpByName = pipe([getByName, not(isEmpty)]);
  const getByName = getByNameCore({ getList, findName });

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getAuthorizer-property

  const getByLive = pipe([
    tap((params) => {
      assert(true);
    }),
    pickParam,
    tryCatch(apiGateway().getAuthorizer, (error, params) =>
      pipe([
        tap(() => {
          logger.error(`error getAuthorizer ${tos({ params, error })}`);
        }),
      ])()
    ),
  ]);

  const isDownByLive = pipe([getByLive, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createAuthorizer-property
  const create = ({ name, payload, resolvedDependencies: { restApi } }) =>
    pipe([
      tap(() => {
        logger.info(`create authorizer: ${name}`);
        logger.debug(tos(payload));
      }),
      () => payload,
      apiGateway().createAuthorizer,
      pipe([
        ({ id }) => ({
          resourceArn: restApiArn({
            config,
            restApiId: restApi.live.id,
          }),
          tags: { ...api.live.tags, [buildTagKey({ id })]: name },
        }),
        apiGateway().tagResource,
      ]),
      tap(() => {
        logger.info(`created authorizer ${name}`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update authorizer: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      apiGateway().updateAuthorizer,
      tap(() => {
        logger.info(`updated authorizer ${name}`);
      }),
    ])();

  const untagResource = (live) =>
    pipe([
      () => ({
        resourceArn: restApiArn({
          config,
          restApiId: live.restApiId,
        }),
        tagKeys: [buildTagKey({ id: live.id })],
      }),
      apiGateway().untagResource,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteAuthorizer-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(live.restApiId);
        assert(live.id);
      }),
      () => live,
      pickParam,
      tryCatch(
        pipe([
          tap(untagResource),
          apiGateway().deleteAuthorizer,
          () =>
            retryCall({
              name: `authorizer isDownByLive: ${live.Name}`,
              fn: () => isDownByLive(live),
              config,
            }),
        ]),
        (error, params) =>
          pipe([
            tap(() => {
              logger.error(`error deleteAuthorizer ${tos({ params, error })}`);
            }),
            () => error,
            switchCase([
              eq(get("code"), "NotFoundException"),
              () => undefined,
              () => {
                throw error;
              },
            ]),
          ])()
      ),
    ])();

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
    create,
    update,
    destroy,
    getByName,
    getByLive,
    getList,
    configDefault,
    shouldRetryOnException,
    findDependencies,
  };
};

const filterTarget = ({ target }) => pipe([() => target, omit(["Tags"])])();
const filterLive = ({ live }) => pipe([() => live, omit(["Tags"])])();

exports.compareAuthorizer = pipe([
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
      tap((params) => {
        assert(true);
      }),
    ])(),
    liveDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
      tap((params) => {
        assert(true);
      }),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compareAuthorizer ${tos(diff)}`);
  }),
]);
