const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  not,
  assign,
  tryCatch,
  or,
  omit,
  switchCase,
} = require("rubico");
const { find, first, defaultsDeep, isEmpty, size, pluck } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const logger = require("@grucloud/core/logger")({
  prefix: "Function",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  getByNameCore,
  isUpByIdCore,
  buildTagsObject,
} = require("@grucloud/core/Common");
const {
  createEndpoint,
  buildTags,
  shouldRetryOnException,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.FunctionName");
const findName = findId;

exports.Function = ({ spec, config }) => {
  const lambda = () => createEndpoint({ endpointName: "Lambda" })(config);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#listFunctions-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList ${tos(params)}`);
      }),
      () => lambda().listFunctions(params),
      get("Functions"),
      map(
        assign({
          Tags: pipe([
            ({ FunctionArn }) => lambda().listTags({ Resource: FunctionArn }),
            get("TagList"),
          ]),
        })
      ),
      tap((results) => {
        logger.debug(`getList: result: ${tos(results)}`);
      }),
      (items = []) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList: #total: ${total}`);
      }),
    ])();

  const getById = ({ id }) =>
    pipe([
      tap(() => {
        logger.info(`getById ${id}`);
      }),
      tryCatch(
        () => lambda().getFunction({ FunctionName: id }),
        switchCase([
          eq(get("code"), "ResourceNotFoundException"),
          () => undefined,
          (error) => {
            throw error;
          },
        ])
      ),
      tap((result) => {
        logger.debug(`getById result: ${tos(result)}`);
      }),
    ])();

  const getByName = ({ name }) => getById({ id: name });

  const isInstanceUp = not(isEmpty);
  const isUpById = isUpByIdCore({ isInstanceUp, getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createFunction-property
  const create = async ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create: ${name}`);
        logger.debug(tos(payload));
      }),
      () => lambda().createFunction(payload),
      get("Function"),
      // tap((fun) =>
      //   retryCall({
      //     name: `key isUpById: ${name}`,
      //     fn: () => isUpById({ name, id: FunctionName }),
      //     config,
      //   })
      // ),
      tap((xxx) => {
        logger.info(`created`);
      }),
    ])();

  //TODO
  const update = async ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => lambda().updateFunctionCode(),
      tap(() => {
        logger.info(`updated`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteFunction-property

  const destroy = async ({ live }) =>
    pipe([
      () => ({ id: findId({ live }) }),
      ({ id }) =>
        pipe([
          tap(() => {
            logger.info(`destroy ${JSON.stringify({ id })}`);
          }),
          () => lambda().deleteFunction({ FunctionName: id }),
          tap(() => {
            logger.info(`destroyed ${JSON.stringify({ id })}`);
          }),
        ])(),
    ])();

  const configDefault = async ({
    name,
    namespace,
    properties,
    dependencies: { role },
  }) =>
    pipe([
      tap(() => {
        assert(role, "missing role dependencies");
      }),
      () => properties,
      defaultsDeep({
        FunctionName: name,
        Role: getField(role, "Arn"),
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
  };
};

const filterTarget = ({ target }) => pipe([() => target, omit(["Tags"])])();
const filterLive = ({ live }) => pipe([() => live, omit(["Tags"])])();

exports.compareFunction = pipe([
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
    ])(),
    liveDiff: pipe([
      () => detailedDiff(live, target),
      omit(["added", "deleted"]),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compareFunction ${tos(diff)}`);
  }),
]);
