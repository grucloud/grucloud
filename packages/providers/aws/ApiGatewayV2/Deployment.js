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
  prefix: "DeploymentV2",
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
const { AwsClient } = require("../AwsClient");
const { buildPayloadDescriptionTags } = require("./ApiGatewayCommon");
const findId = get("live.DeploymentId");
const findName = findNameInTagsOrId({ findId });

exports.Deployment = ({ spec, config }) => {
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
      type: "Stage",
      group: "ApiGatewayV2",
      ids: pipe([
        () =>
          lives.getByType({
            providerName: config.providerName,
            type: "Stage",
            group: "ApiGatewayV2",
          }),
        filter(eq(get("live.DeploymentId"), live.DeploymentId)),
        pluck("id"),
      ])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getDeployments-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList deployment`);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Api",
          group: "ApiGatewayV2",
        }),
      pluck("id"),
      flatMap((ApiId) =>
        tryCatch(
          pipe([
            () => apiGateway().getDeployments({ ApiId }),
            get("Items"),
            map(defaultsDeep({ ApiId })),
            map(
              assign({
                Tags: tagsExtractFromDescription,
                Description: tagsRemoveFromDescription,
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createDeployment-property
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteDeployment-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      pick(["ApiId", "DeploymentId"]),
      tap((params) => {
        logger.info(`destroy deployment ${JSON.stringify(params)}`);
        assert(live.ApiId);
        assert(live.DeploymentId);
      }),
      tap(
        tryCatch(apiGateway().deleteDeployment, (error) =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => undefined,
          ])()
        )
      ),
      tap((params) => {
        logger.debug(`destroyed deployment ${JSON.stringify(params)}`);
      }),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { api, stage },
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        ApiId: getField(api, "ApiId"),
        StageName: getField(stage, "StageName"),
        Tags: buildTagsObject({ name, namespace, config, userTags: Tags }),
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
