const assert = require("assert");
const {
  map,
  pipe,
  tap,
  set,
  get,
  eq,
  not,
  assign,
  filter,
  omit,
  tryCatch,
  switchCase,
  pick,
} = require("rubico");
const {
  pluck,
  first,
  identity,
  defaultsDeep,
  isEmpty,
  size,
} = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const logger = require("@grucloud/core/logger")({
  prefix: "RestApi",
});
//const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
//const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.id");
const findName = get("live.name");

exports.RestApi = ({ spec, config }) => {
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getRestApis-property
  const getList = () =>
    pipe([
      tap(() => {
        logger.info(`getRestApis`);
      }),
      apiGateway().getRestApis,
      get("items"),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createRestApi-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`createRestApi: ${name}`);
        logger.debug(tos(payload));
      }),
      () => apiGateway().createRestApi(payload),
      tap(() => {
        logger.info(`created rest api ${name}`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update api: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      apiGateway().updateRestApi,
      tap(() => {
        logger.info(`updated api ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteRestApi-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(live.id);
      }),
      () => ({ restApiId: live.id }),
      tryCatch(apiGateway().deleteRestApi, (error, params) =>
        pipe([
          tap(() => {
            logger.error(`error deleteRestApi ${tos({ params, error })}`);
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

  const configDefault = ({ name, namespace, properties, dependencies: {} }) =>
    pipe([
      tap(() => {}),
      () => properties,
      defaultsDeep({
        name,
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
    //findDependencies,
  };
};

const filterTarget = ({ target }) => pipe([() => target, omit(["Tags"])])();
const filterLive = ({ live }) => pipe([() => live, omit(["Tags"])])();

exports.compareRestApi = pipe([
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
    logger.debug(`compareApi ${tos(diff)}`);
  }),
]);
