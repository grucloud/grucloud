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
  prefix: "Stage",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.stageName");
const findName = get("live.stageName");

const pickParam = pick(["restApiId", "stageName"]);

exports.Stage = ({ spec, config }) => {
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "RestApi",
      group: "apiGateway",
      ids: [live.restApiId],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getStages-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList stage`);
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
            () => apiGateway().getStages({ restApiId }),
            get("items"),
            map(defaultsDeep({ restApiId })),
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
      (items = []) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList stage #total: ${total}`);
      }),
    ])();

  //const isUpByName = pipe([getByName, not(isEmpty)]);
  const getByName = getByNameCore({ getList, findName });

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getStage-property

  const getByLive = pipe([
    tap((params) => {
      assert(true);
    }),
    pickParam,
    tryCatch(apiGateway().getStage, (error) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => undefined,
      ])()
    ),
  ]);

  const isDownByLive = pipe([getByLive, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createStage-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create stage: ${name}`);
        logger.debug(tos(payload));
      }),
      () => payload,
      apiGateway().createStage,
      tap(() => {
        logger.info(`created stage ${name}`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update stage: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      apiGateway().updateStage,
      tap(() => {
        logger.info(`updated stage ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteStage-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(live.restApiId);
        assert(live.stageName);
      }),
      () => live,
      pickParam,
      tryCatch(apiGateway().deleteStage, (error, params) =>
        pipe([
          tap(() => {
            logger.error(`error deleteStage ${tos({ params, error })}`);
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
      tap(() =>
        retryCall({
          name: `stage isDownByLive: ${live.StageName}`,
          fn: () => isDownByLive(live),
          config,
        })
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
        stageName: name,
        restApiId: getField(restApi, "id"),
        tags: buildTagsObject({ config, namespace, name }),
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

exports.compareStage = pipe([
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
    logger.debug(`compareStage ${tos(diff)}`);
  }),
]);
