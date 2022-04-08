const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  assign,
  filter,
  tryCatch,
  pick,
  eq,
  fork,
  omit,
} = require("rubico");
const {
  pluck,
  values,
  defaultsDeep,
  includes,
  callProp,
  when,
  find,
  first,
} = require("rubico/x");
const path = require("path");
const { fetchZip, createZipBuffer, computeHash256 } = require("./LambdaCommon");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "Function",
});
const { tos } = require("@grucloud/core/tos");
const { buildTagsObject } = require("@grucloud/core/Common");
const { throwIfNotAwsError, compareAws } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { createLambda, tagResource, untagResource } = require("./LambdaCommon");

const compareLambda = compareAws({});
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
  const lambda = createLambda(config);
  const client = AwsClient({ spec, config })(lambda);

  const findDependenciesInEnvironment = ({
    pathLive,
    type,
    group,
    live,
    lives,
  }) => ({
    type,
    group,
    ids: pipe([
      () => live,
      get("Configuration.Environment.Variables"),
      map((value) =>
        pipe([
          () =>
            lives.getByType({
              providerName: config.providerName,
              type,
              group,
            }),
          find(eq(get(pathLive), value)),
          get("id"),
        ])()
      ),
      values,
    ])(),
  });

  const findDependencies = ({ live, lives }) => [
    findDependenciesInEnvironment({
      pathLive: "live.ARN",
      type: "Secret",
      group: "SecretsManager",
      live,
      lives,
    }),
    findDependenciesInEnvironment({
      pathLive: "live.uris.GRAPHQL",
      type: "GraphqlApi",
      group: "AppSync",
      live,
      lives,
    }),
    findDependenciesInEnvironment({
      pathLive: "live.DBClusterArn",
      type: "DBCluster",
      group: "RDS",
      live,
      lives,
    }),

    findDependenciesInEnvironment({
      pathLive: "live.TableName",
      type: "Table",
      group: "DynamoDB",
      live,
      lives,
    }),
    {
      type: "Role",
      group: "IAM",
      ids: [live.Configuration.Role],
    },
    {
      type: "Key",
      group: "KMS",
      ids: [live.Configuration.KMSKeyArn],
    },
    {
      type: "Subnets",
      group: "EC2",
      ids: pipe([() => live, get("Configuration.VpcConfig.SubnetIds")])(),
    },
    {
      type: "SecurityGroup",
      group: "EC2",
      ids: pipe([
        () => live,
        get("Configuration.VpcConfig.SecurityGroupIds"),
      ])(),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#getFunction-property
  const getById = client.getById({
    pickId,
    method: "getFunction",
    ignoreErrorCodes: ["ResourceNotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#listFunctions-property
  const getList = client.getList({
    method: "listFunctions",
    getParam: "Functions",
    decorate: () =>
      pipe([
        pick(["FunctionName"]),
        lambda().getFunction,
        pick(["Configuration", "Code", "Tags"]),
        assign({
          FunctionUrlConfig: pipe([
            get("Configuration"),
            pick(["FunctionName"]),
            lambda().listFunctionUrlConfigs,
            get("FunctionUrlConfigs"),
            first,
          ]),
          Policy: tryCatch(
            pipe([
              get("Configuration"),
              pick(["FunctionName"]),
              lambda().getPolicy,
              get("Policy"),
              tryCatch(JSON.parse, () => undefined),
            ]),
            throwIfNotAwsError("ResourceNotFoundException")
          ),
          Code: pipe([
            get("Code"),
            assign({
              Data: pipe([fetchZip()]),
            }),
          ]),
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
        }),
      ]),
  });

  const getByName = pipe([
    ({ name }) => ({ Configuration: { FunctionArn: name } }),
    getById,
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createFunction-property
  const create = client.create({
    method: "createFunction",
    filterPayload: ({ Configuration, Tags }) =>
      pipe([
        tap(() => {
          assert(Configuration);
        }),
        () => ({ ...Configuration, Tags }),
      ])(),
    pickCreated: () =>
      pipe([
        tap(({ FunctionArn }) => {
          assert(FunctionArn);
        }),
        ({ FunctionArn }) => ({ Configuration: { FunctionArn } }),
      ]),
    shouldRetryOnExceptionMessages: [
      "The role defined for the function cannot be assumed by Lambda",
    ],
    getById,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createFunctionUrlConfig-property
    postCreate:
      ({
        payload: {
          Configuration: { FunctionName },
          FunctionUrlConfig,
        },
      }) =>
      ({}) =>
        when(
          () => FunctionUrlConfig,
          pipe([
            tap(() => {
              assert(FunctionName);
            }),
            () => FunctionUrlConfig,
            defaultsDeep({ FunctionName }),
            tap((params) => {
              assert(true);
            }),
            lambda().createFunctionUrlConfig,
          ])
        ),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#updateFunctionConfiguration-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#updateFunctionCode-property
  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update function: ${name}`);
        assert(diff);
      }),
      () => ({
        FunctionName: payload.Configuration.FunctionName,
        ZipFile: payload.Configuration.Code.ZipFile,
      }),
      // updateFunctionConfiguration
      lambda().updateFunctionCode,
      () =>
        retryCall({
          name: `update function code ${name}`,
          fn: pipe([
            () => payload,
            tap((params) => {
              assert(true);
            }),
            get("Configuration"),
            pick(["FunctionName"]),
            tap((params) => {
              assert(true);
            }),
            lambda().getFunction,
            eq(get("Configuration.LastUpdateStatus"), "Successful"),
          ]),
        }),
      // updateFunctionConfiguration
      when(
        () => diff.liveDiff.updated.Configuration,
        pipe([
          () => payload,
          get("Configuration"),
          lambda().updateFunctionConfiguration,
          tap(() => {
            logger.info(`updated function done ${name}`);
          }),
        ])
      ),
      // updateFunctionUrlConfig
      when(
        () => diff.liveDiff.updated.FunctionUrlConfig,
        pipe([
          tap((params) => {
            assert(true);
          }),
          () => ({
            FunctionName: payload.Configuration.FunctionName,
            ...payload.FunctionUrlConfig,
          }),
          lambda().updateFunctionUrlConfig,
        ])
      ),
      tap(() => {
        logger.info(`updated function done ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteFunction-property
  const destroy = client.destroy({
    preDestroy: ({ name, live }) =>
      pipe([
        () => live,
        when(
          get("FunctionUrlConfig"),
          pipe([
            get("Configuration"),
            pick(["FunctionName"]),
            lambda().deleteFunctionUrlConfig,
          ])
        ),
      ])(),
    pickId,
    method: "deleteFunction",
    getById,
    ignoreErrorCodes: ["ResourceNotFoundException"],
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { role, layers = [], kmsKey, subnets, securityGroups },
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
          () => otherProps,
          defaultsDeep({
            Tags: buildTagsObject({
              config,
              namespace,
              name,
              userTags: Tags,
            }),
            Configuration: {
              FunctionName: name,
              Role: getField(role, "Arn"),
              Layers: pipe([
                () => layers,
                map((layer) => getField(layer, "LayerVersionArn")),
              ])(),
              Code: { ZipFile },
            },
          }),
          when(
            () => kmsKey,
            defaultsDeep({ KMSKeyArn: getField(kmsKey, "Arn") })
          ),
          when(
            () => subnets,
            defaultsDeep({
              VpcConfig: {
                SubnetIds: pipe([
                  () => subnets,
                  map((subnet) => getField(subnet, "SubnetId")),
                ])(),
              },
            })
          ),
          when(
            () => securityGroups,
            defaultsDeep({
              VpcConfig: {
                SecurityGroupIds: pipe([
                  () => securityGroups,
                  map((sg) => getField(sg, "GroupId")),
                ])(),
              },
            })
          ),
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
    findDependencies,
    tagResource: tagResource({ lambda }),
    untagResource: untagResource({ lambda }),
  };
};

const filterFunctionUrlConfig = pipe([
  get("FunctionUrlConfig"),
  omit(["CreationTime", "LastModifiedTime", "FunctionArn", "FunctionUrl"]),
]);

exports.filterFunctionUrlConfig = filterFunctionUrlConfig;
exports.compareFunction = pipe([
  tap((params) => {
    assert(true);
  }),
  compareLambda({
    filterTarget: () => (target) =>
      pipe([
        () => target,
        tap((params) => {
          assert(target);
        }),
        defaultsDeep({
          Configuration: {
            CodeSha256: pipe([
              () => target,
              get("Configuration.Code.ZipFile"),
              computeHash256,
            ])(),
          },
        }),
      ])(),
    filterLive: () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        assign({ FunctionUrlConfig: filterFunctionUrlConfig }),
      ]),
  }),
  tap((diff) => {
    logger.debug(`compareFunction ${tos(diff)}`);
  }),
]);
