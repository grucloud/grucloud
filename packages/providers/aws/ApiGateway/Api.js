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
  prefix: "Api",
});
//const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
//const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.ApiId");
const findName = get("live.Name");

exports.Api = ({ spec, config }) => {
  const apiGateway = () =>
    createEndpoint({ endpointName: "ApiGatewayV2" })(config);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getApi-property
  const getList = () =>
    pipe([
      tap(() => {
        logger.info(`getList apis`);
      }),
      apiGateway().getApis,
      get("Items"),
      (items = []) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList apis #total: ${total}`);
      }),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createApi-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create api: ${name}`);
        logger.debug(tos(payload));
      }),
      () => apiGateway().createApi(payload),
      tap(() => {
        logger.info(`created api ${name}`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update api: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      apiGateway().updateApi,
      tap(() => {
        logger.info(`updated api ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteFunction-property
  const destroy = ({ live }) =>
    pipe([
      () => ({ ApiId: findId({ live }) }),
      tap((params) => {
        logger.info(`destroy ${JSON.stringify(params)}`);
      }),
      tap(apiGateway().deleteApi),
      tap((params) => {
        logger.info(`destroyed ${JSON.stringify(params)}`);
      }),
    ])();

  const configDefault = ({ name, namespace, properties, dependencies: {} }) =>
    pipe([
      tap(() => {}),
      () => properties,
      defaultsDeep({
        Name: name,
        ProtocolType: "HTTP",
        Tags: buildTagsObject({ config, namespace, name }),
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

exports.compareApi = pipe([
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
