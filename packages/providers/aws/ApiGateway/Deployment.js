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

const logger = require("@grucloud/core/logger")({
  prefix: "Deployment",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const {
  createEndpoint,
  shouldRetryOnException,
  tagsExtractFromDescription,
  tagsRemoveFromDescription,
  findNameInTagsOrId,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildPayloadDescriptionTags } = require("./ApiGatewayCommon");

const findId = get("live.id");
const findName = findNameInTagsOrId({ findId });
const pickParam = ({ restApiId, id }) => ({ restApiId, deploymentId: id });

exports.Deployment = ({ spec, config }) => {
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "RestApi",
      group: "apiGateway",
      ids: [live.ApiId],
    },
    {
      type: "Stage",
      group: "apiGateway",
      ids: pipe([
        () =>
          lives.getByType({
            providerName: config.providerName,
            type: "Stage",
            group: "apiGateway",
          }),
        filter(eq(get("live.id"), live.deploymentId)),
        pluck("id"),
      ])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getDeployments-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList deployment`);
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
            () => apiGateway().getDeployments({ restApiId }),
            get("items"),
            map(defaultsDeep({ restApiId })),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createDeployment-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create deployment: ${name}`);
        logger.debug(tos(payload));
      }),
      () => payload,
      buildPayloadDescriptionTags,
      apiGateway().createDeployment,
      tap(() => {
        logger.info(`created deployment ${name}`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update deployment: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      apiGateway().updateDeployment,
      tap(() => {
        logger.info(`updated deployment ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteDeployment-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      pickParam,
      tap((params) => {
        logger.info(`destroy deployment ${JSON.stringify(params)}`);
        assert(params.restApiId);
        assert(params.deploymentId);
      }),
      tap(
        tryCatch(apiGateway().deleteDeployment, (error) =>
          pipe([
            tap(() => {
              logger.error(`deleteDeployment ${JSON.stringify(error)}`);
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
        )
      ),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { restApi, stage },
  }) =>
    pipe([
      tap(() => {
        assert(restApi, "missing 'restApi' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        restApiId: getField(restApi, "id"),
        stageName: getField(stage, "name"),
        tags: buildTagsObject({ name, namespace, config, userTags: tags }),
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

exports.compareDeployment = pipe([
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
    logger.debug(`compareDeployment ${tos(diff)}`);
  }),
]);
