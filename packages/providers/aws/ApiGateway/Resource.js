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
const { pluck, defaultsDeep, size, isEmpty } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "Resource",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.id");
const findName = get("live.path");
const pickParam = ({ restApiId, id }) => ({
  restApiId,
  resourceId: id,
});

exports.Resource = ({ spec, config }) => {
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "RestApi",
      group: "apiGateway",
      ids: [live.restApiId],
    },
  ];
  const cannotBeDeleted = pipe([
    tap((params) => {
      assert(true);
    }),
    get("live.parentId"),
    isEmpty,
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getResources-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList resource`);
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
            () => apiGateway().getResources({ restApiId }),
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
        logger.info(`getList resource #total: ${total}`);
      }),
    ])();

  //const isUpByName = pipe([getByName, not(isEmpty)]);
  const getByName = getByNameCore({ getList, findName });

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getResource-property

  const getByLive = pipe([
    tap((params) => {
      assert(true);
    }),
    pickParam,
    tryCatch(apiGateway().getResource, (error) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => undefined,
      ])()
    ),
  ]);

  const isDownByLive = pipe([getByLive, isEmpty]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createResource-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create resource: ${name}`);
        logger.debug(tos(payload));
      }),
      () => payload,
      apiGateway().createResource,
      tap(() => {
        logger.info(`created resource ${name}`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update resource: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      apiGateway().updateResource,
      tap(() => {
        logger.info(`updated resource ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteResource-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(live.restApiId);
        assert(live.id);
      }),
      () => live,
      pickParam,
      tryCatch(apiGateway().deleteResource, (error, params) =>
        pipe([
          tap(() => {
            logger.error(`error deleteResource ${tos({ params, error })}`);
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
          name: `resource isDownByLive: ${live.ResourceName}`,
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
        pathPart: name,
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
    cannotBeDeleted,
  };
};

const filterTarget = ({ target }) => pipe([() => target, omit(["Tags"])])();
const filterLive = ({ live }) => pipe([() => live, omit(["Tags"])])();

exports.compareResource = pipe([
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
    logger.debug(`compareResource ${tos(diff)}`);
  }),
]);
