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
const { isEmpty, callProp, defaultsDeep, size } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const logger = require("@grucloud/core/logger")({
  prefix: "Route",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.RouteId");
const findName = get("live.RouteKey");

exports.Route = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const apiGateway = () =>
    createEndpoint({ endpointName: "ApiGatewayV2" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Api",
      group: "ApiGatewayV2",
      ids: [live.ApiId],
    },
    {
      type: "Integration",
      group: "ApiGatewayV2",
      ids: pipe([
        () => live,
        get("Target", ""),
        callProp("replace", "integrations/", ""),
        (target) => [target],
        filter(not(isEmpty)),
      ])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getRoutes-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList route`);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Api",
          group: "ApiGatewayV2",
        }),
      flatMap(({ id: ApiId, live }) =>
        tryCatch(
          pipe([
            () => apiGateway().getRoutes({ ApiId }),
            get("Items"),
            map(defaultsDeep({ ApiId })),
            //TODO
            map(assign({ Tags: () => live.Tags })),
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

  //const isUpByName = pipe([getByName, not(isEmpty)]);
  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createRoute-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create route: ${name}`);
        logger.debug(tos(payload));
      }),
      () => payload,
      apiGateway().createRoute,
      tap(() => {
        logger.info(`created route ${name}`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update route: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      defaultsDeep({ RouteId: live.RouteId }),
      apiGateway().updateRoute,
      tap(() => {
        logger.info(`updated route ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteRoute-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      pick(["ApiId", "RouteId"]),
      tap((params) => {
        logger.info(`destroy route ${JSON.stringify(params)}`);
        assert(live.ApiId);
        assert(live.RouteId);
      }),
      tap(apiGateway().deleteRoute),
      tap((params) => {
        logger.debug(`destroyed route ${JSON.stringify(params)}`);
      }),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { api, integration },
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
        assert(integration, "missing 'integration' dependency");
      }),
      () => properties,
      defaultsDeep({
        RouteKey: name,
        ApiId: getField(api, "ApiId"),
        Target: `integrations/${getField(integration, "IntegrationId")}`,
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
    getList,
    configDefault,
    shouldRetryOnException,
    findDependencies,
  };
};

const filterTarget = ({ target }) => pipe([() => target, omit(["Tags"])])();
const filterLive = ({ live }) => pipe([() => live, omit(["Tags"])])();

exports.compareRoute = pipe([
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
    logger.debug(`compareRoute ${tos(diff)}`);
  }),
]);
