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

const findId = get("live.AuthorizerId");
const findName = get("live.Name");
const pickParam = pick(["ApiId", "AuthorizerId"]);

const buildTagKey = ({ AuthorizerId }) => `gc-autorizer-${AuthorizerId}`;

const apiArn = ({ config, ApiId }) =>
  `arn:aws:apigateway:${config.region}::/apis/${ApiId}`;

exports.Authorizer = ({ spec, config }) => {
  const apiGateway = () =>
    createEndpoint({ endpointName: "ApiGatewayV2" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Api",
      group: "apiGatewayV2",
      ids: [live.ApiId],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getAuthorizers-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList authorizer`);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Api",
          group: "apiGatewayV2",
        }),
      pluck("id"),
      flatMap((ApiId) =>
        tryCatch(
          pipe([
            () => apiGateway().getAuthorizers({ ApiId }),
            get("Items"),
            map(defaultsDeep({ ApiId })),
            map(
              assign({
                Tags: ({ AuthorizerId }) =>
                  pipe([
                    () =>
                      apiGateway().getTags({
                        ResourceArn: apiArn({
                          config,
                          ApiId,
                        }),
                      }),
                    get("Tags"),
                    assign({ Name: get(buildTagKey({ AuthorizerId })) }),
                    omit([buildTagKey({ AuthorizerId })]),
                  ])(),
              })
            ),
          ]),
          (error) =>
            pipe([
              tap((params) => {
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

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getAuthorizer-property

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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createAuthorizer-property
  const create = ({ name, payload, resolvedDependencies: { api } }) =>
    pipe([
      tap(() => {
        logger.info(`create authorizer: ${name}`);
        logger.debug(tos(payload));
      }),
      () => payload,
      apiGateway().createAuthorizer,
      pipe([
        ({ AuthorizerId }) => ({
          ResourceArn: apiArn({
            config,
            ApiId: api.live.ApiId,
          }),
          Tags: { ...api.live.Tags, [buildTagKey({ AuthorizerId })]: name },
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
        ResourceArn: apiArn({
          config,
          ApiId: live.ApiId,
        }),
        TagKeys: [buildTagKey({ AuthorizerId: live.AuthorizerId })],
      }),
      apiGateway().untagResource,
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteAuthorizer-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(live.ApiId);
        assert(live.AuthorizerId);
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
    dependencies: { api },
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
      }),
      () => properties,
      defaultsDeep({
        Name: name,
        ApiId: getField(api, "ApiId"),
        //Tags: buildTagsObject({ config, namespace, name }),
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
