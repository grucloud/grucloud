const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  assign,
  filter,
  omit,
  tryCatch,
  switchCase,
  pick,
} = require("rubico");
const { pluck, defaultsDeep, includes, callProp } = require("rubico/x");
const path = require("path");
const { fetchZip, createZipBuffer, computeHash256 } = require("./LambdaCommon");

const logger = require("@grucloud/core/logger")({
  prefix: "Function",
});
const { tos } = require("@grucloud/core/tos");
const { buildTagsObject } = require("@grucloud/core/Common");
const {
  compareAws,
  createEndpoint,
  shouldRetryOnException,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.Configuration.FunctionArn");
const findName = get("live.Configuration.FunctionName");
const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  tap(({ Configuration }) => {
    assert(Configuration);
  }),
  ({ Configuration: { FunctionArn } }) => ({
    FunctionName: FunctionArn,
  }),
]);
const removeVersion = pipe([
  callProp("split", ":"),
  callProp("slice", 0, -1),
  callProp("join", ":"),
]);

exports.Function = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const lambda = () => createEndpoint({ endpointName: "Lambda" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Role",
      group: "IAM",
      ids: [live.Configuration.Role],
    },
    {
      type: "Layer",
      group: "Lambda",
      ids: pipe([
        () => live,
        get("Configuration.Layers"),
        pluck("Arn"),
        (layersArn) =>
          pipe([
            () =>
              lives.getByType({
                providerName: config.providerName,
                type: "Layer",
                group: "Lambda",
              }),
            filter(
              pipe([
                get("live.LayerVersionArn"),
                removeVersion,
                (layerVersionArn) =>
                  pipe([
                    () => layersArn,
                    map(removeVersion),
                    includes(layerVersionArn),
                  ])(),
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
              pick(["Configuration", "Code", "Tags"]),
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
        ])()
      ),
      map(
        assign({
          //TODO
          // CodeSigningConfigArn: pipe([
          //   get("Configuration"),
          //   pick(["FunctionName"]),
          //   lambda().getFunctionCodeSigningConfig,
          //   get("CodeSigningConfigArn"),
          // ]),
          // ReservedConcurrentExecutions: pipe([
          //   get("Configuration"),
          //   pick(["FunctionName"]),
          //   lambda().getFunctionConcurrency,
          //   get("ReservedConcurrentExecutions"),
          // ]),
          Policy: tryCatch(
            pipe([
              get("Configuration"),
              tap((params) => {
                assert(true);
              }),
              pick(["FunctionName"]),
              lambda().getPolicy,
              get("Policy"),
              tryCatch(JSON.parse, () => undefined),
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
  const getList = () => pipe([listFunctions])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#getFunction-property
  const getById = client.getById({
    pickId,
    method: "getFunction",
    ignoreErrorCodes: ["ResourceNotFoundException"],
  });

  const getByName = pipe([
    ({ name }) => ({ Configuration: { FunctionArn: name } }),
    getById,
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createFunction-property
  const create = client.create({
    method: "createFunction",
    pickCreated: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        ({ FunctionArn }) => ({ Configuration: { FunctionArn: FunctionArn } }),
      ]),
    pickId,
    shouldRetryOnException: ({ error }) =>
      pipe([
        tap(() => {
          logger.error(`createFunction isExpectedException ${tos(error)}`);
        }),
        () => error,
        eq(get("code"), "InvalidParameterValueException"),
      ])(),
    getById,
    config,
  });

  // TODO update
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
      lambda().updateFunctionCode,
      tap(() => {
        logger.info(`updated function ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteFunction-property
  const destroy = client.destroy({
    pickId,
    method: "deleteFunction",
    getById,
    config,
    ignoreErrorCodes: ["ResourceNotFoundException"],
  });

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { role, layers = [] },
    programOptions,
  }) =>
    pipe([
      tap(() => {
        assert(programOptions);
        assert(role, "missing role dependencies");
        assert(Array.isArray(layers), "layers must be an array");
      }),
      () =>
        createZipBuffer({
          localPath: path.resolve(programOptions.workingDirectory, name),
        }),
      (ZipFile) =>
        pipe([
          () => properties,
          defaultsDeep({
            FunctionName: name,
            Role: getField(role, "Arn"),
            Tags: buildTagsObject({ config, namespace, name }),
            Layers: pipe([
              () => layers,
              map((layer) => getField(layer, "LayerVersionArn")),
            ])(),
            Code: { ZipFile },
          }),
        ])(),
    ])();

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
    getById,
    getList,
    configDefault,
    shouldRetryOnException,
    findDependencies,
  };
};

exports.compareFunction = pipe([
  tap((params) => {
    assert(true);
  }),
  compareAws({
    filterTarget: () =>
      pipe([
        assign({ CodeSha256: pipe([get("Code.ZipFile"), computeHash256]) }),
        pick([
          "Handler",
          "PackageType",
          "Runtime",
          "Description",
          "LicenseInfo",
          "Timeout",
          "MemorySize",
          "Environment",
          "CodeSha256",
        ]),
      ]),
    filterLive: () =>
      pipe([
        get("Configuration"),
        pick([
          "Handler",
          "PackageType",
          "Runtime",
          "Description",
          "LicenseInfo",
          "Timeout",
          "MemorySize",
          "Environment",
          "CodeSha256",
        ]),
      ]),
  }),
  tap((diff) => {
    logger.debug(`compareFunction ${tos(diff)}`);
  }),
]);
