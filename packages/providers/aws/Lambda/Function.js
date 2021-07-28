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
  includes,
  unless,
} = require("rubico/x");
const crypto = require("crypto");

const { detailedDiff } = require("deep-object-diff");
const { fetchZip } = require("./LambdaCommon");

const logger = require("@grucloud/core/logger")({
  prefix: "Function",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { buildTagsObject } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.FunctionArn");
const findName = get("live.FunctionName");

exports.Function = ({ spec, config }) => {
  const lambda = () => createEndpoint({ endpointName: "Lambda" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Role",
      group: "iam",
      ids: [live.Role],
    },
    {
      type: "Layer",
      group: "lambda",
      ids: pipe([
        () => live,
        get("Layers"),
        (layersFunction) =>
          pipe([
            () =>
              lives.getByType({
                providerName: config.providerName,
                type: "Layer",
                group: "lambda",
              }),
            filter(
              pipe([
                get("live.LayerVersionArn"),
                (layerVersionArn) =>
                  pipe([() => layersFunction, includes(layerVersionArn)])(),
              ])
            ),
          ])(),
        pluck("id"),
      ])(),
    },
  ];

  const listFunctions = ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`listFunctions ${tos(params)}`);
      }),
      () => lambda().listFunctions(params),
      get("Functions"),
      map((fun) =>
        pipe([
          () => fun,
          tryCatch(
            pipe([
              pick(["FunctionName"]),
              lambda().getFunction,
              pick(["Code", "Tags"]),
              assign({
                Code: pipe([
                  get("Code"),
                  assign({
                    Data: pipe([fetchZip()]),
                  }),
                ]),
              }),
            ]),
            (error) => pipe([() => ({ error })])()
          ),
          defaultsDeep(fun),
        ])()
      ),
      map(
        assign({
          Layers: pipe([get("Layers"), pluck("Arn")]),
          CodeSigningConfigArn: pipe([
            pick(["FunctionName"]),
            lambda().getFunctionCodeSigningConfig,
            get("CodeSigningConfigArn"),
          ]),
          ReservedConcurrentExecutions: pipe([
            pick(["FunctionName"]),
            lambda().getFunctionConcurrency,
            get("ReservedConcurrentExecutions"),
          ]),
          Policy: tryCatch(
            pipe([
              pick(["FunctionName"]),
              lambda().getPolicy,
              tap((params) => {
                assert(true);
              }),
            ]),
            pipe([
              switchCase([
                eq(get("code"), "ResourceNotFoundException"),
                () => undefined,
                (error) => {
                  throw error;
                },
              ]),
            ])
          ),
        })
      ),
      tap((results) => {
        logger.debug(`listFunctions: result: ${tos(results)}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#listFunctions-property
  const getList = () =>
    pipe([
      tap(() => {
        logger.info(`getList function`);
      }),
      listFunctions,
      (items = []) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList function #total: ${total}`);
      }),
    ])();

  const getByName = ({ name }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}`);
      }),
      () => listFunctions({ FunctionName: name }),
      first,
      tap((result) => {
        logger.debug(`getByName result: ${tos(result)}`);
      }),
    ])();

  const isUpByName = pipe([getByName, not(isEmpty)]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createFunction-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create lambda: ${name}`);
        logger.debug(tos(payload));
      }),
      () =>
        retryCall({
          name: `createFunction: ${name}`,
          fn: () => lambda().createFunction(payload),
          config: { retryCount: 10, retryDelay: 2e3 },
          shouldRetryOnException: ({ error }) =>
            pipe([
              tap(() => {
                logger.error(
                  `createFunction isExpectedException ${tos(error)}`
                );
              }),
              () => error,
              get("message"),
              includes(
                "The role defined for the function cannot be assumed by Lambda"
              ),
            ])(),
        }),
      get("Function"),
      tap((FunctionName) =>
        retryCall({
          name: `key isUpByName: ${name}`,
          fn: () => isUpByName({ name: FunctionName }),
          config,
        })
      ),
      tap(() => {
        logger.info(`created`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update function: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => ({
        FunctionName: payload.FunctionName,
        ZipFile: payload.Code.ZipFile,
      }),
      (params) => lambda().updateFunctionCode(params),
      tap(() => {
        logger.info(`updated function ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteFunction-property
  const destroy = ({ live }) =>
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

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { role, layers = [] },
  }) =>
    pipe([
      tap(() => {
        assert(role, "missing role dependencies");
        assert(Array.isArray(layers), "layers must be an array");
      }),
      () => properties,
      defaultsDeep({
        FunctionName: name,
        Role: getField(role, "Arn"),
        Tags: buildTagsObject({ config, namespace, name }),
        Layers: pipe([
          () => layers,
          map((layer) => getField(layer, "LayerVersionArn")),
        ])(),
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

const computeHash256 = ({ target }) =>
  pipe([
    () => crypto.createHash("sha256"),
    (hash256) =>
      pipe([
        () => hash256.update(target.Code.ZipFile),
        () => hash256.digest("base64"),
      ])(),
  ])();

const isEqualHash256 = ({ target, live }) =>
  pipe([() => computeHash256({ target }), eq(identity, live.CodeSha256)])();

exports.compareFunction = pipe([
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
      unless(
        () => isEqualHash256({ target, live }),
        assign({ updated: () => ({ CodeSha256: live.CodeSha256 }) })
      ),
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
      unless(
        () => isEqualHash256({ target, live }),
        assign({ updated: () => ({ CodeSha256: computeHash256({ target }) }) })
      ),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compareFunction ${tos(diff)}`);
  }),
]);
