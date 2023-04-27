const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  assign,
  tryCatch,
  pick,
  eq,
  omit,
  any,
  reduce,
  switchCase,
  and,
  filter,
  or,
} = require("rubico");
const {
  defaultsDeep,
  callProp,
  when,
  unless,
  isEmpty,
  pluck,
  append,
  isIn,
  includes,
} = require("rubico/x");
const path = require("path");

const AdmZip = require("adm-zip");

const { fetchZip, createZipBuffer, computeHash256 } = require("./LambdaCommon");
const { retryCall } = require("@grucloud/core/Retry");

const logger = require("@grucloud/core/logger")({
  prefix: "Function",
});

const { replaceWithName } = require("@grucloud/core/Common");

const { buildTagsObject, omitIfEmpty } = require("@grucloud/core/Common");
const {
  compareAws,
  replaceEnv,
  buildDependenciesFromEnv,
  replaceAccountAndRegion,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { Tagger } = require("./LambdaCommon");

const compareLambda = compareAws({});
const findId = () => get("Configuration.FunctionArn");
const findName = () => get("Configuration.FunctionName");

const buildArn = () =>
  pipe([
    get("Configuration.FunctionArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap((params) => {
    assert(params);
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
exports.removeVersion = removeVersion;

const eventInvokeConfigDependencies = [
  { type: "Function", group: "Lambda", prefix: "lambdaFunction" },
  { type: "Topic", group: "SNS", prefix: "snsTopic" },
  { type: "EventBus", group: "CloudWatchEvents", prefix: "cloudWatchEventBus" },
  { type: "Queue", group: "SQS", prefix: "sqsQueue" },
];

const buildInvokeConfigDependency =
  ({ type, group, prefix }) =>
  (method) => ({
    [`${prefix}${method}`]: {
      type,
      group,
      dependencyId: () =>
        get(`EventInvokeConfig.DestinationConfig.${method}.Destination`),
    },
  });

const buildEventInvokeConfigDependencies = pipe([
  () => eventInvokeConfigDependencies,
  reduce(
    (acc, dep) => ({
      ...acc,
      ...buildInvokeConfigDependency(dep)("OnSuccess"),
      ...buildInvokeConfigDependency(dep)("OnFailure"),
    }),
    {}
  ),
]);

exports.buildEventInvokeConfigDependencies = buildEventInvokeConfigDependencies;

const managedByOther =
  ({ lives, config }) =>
  (live) =>
    or([
      //CloudWatch Synthetics
      pipe([
        () => live,
        get("Configuration.FunctionName"),
        callProp("startsWith", "cwsyn"),
      ]),
      pipe([
        lives.getByType({
          type: "Stack",
          group: "CloudFormation",
          providerName: config.providerName,
        }),
        any(
          pipe([
            get("name"),
            append("-AWS"),
            (stackName) => live.Configuration.FunctionName.includes(stackName),
          ])
        ),
      ]),
    ])();

const decorate = ({ endpoint }) =>
  pipe([
    pick(["Configuration", "Code", "Tags"]),
    assign({
      Configuration: pipe([
        get("Configuration"),
        unless(
          pipe([get("Layers"), isEmpty]),
          assign({
            Layers: pipe([get("Layers"), pluck("Arn")]),
          })
        ),
      ]),
      EventInvokeConfig: tryCatch(
        pipe([
          get("Configuration"),
          pick(["FunctionName"]),
          endpoint().getFunctionEventInvokeConfig,
          pick([
            "DestinationConfig",
            "MaximumRetryAttempts",
            "MaximumEventAgeInSeconds",
          ]),
        ]),
        (error, params) => {
          return;
        }
      ),
      FunctionUrlConfig: tryCatch(
        pipe([
          get("Configuration"),
          pick(["FunctionName"]),
          endpoint().getFunctionUrlConfig,
          // For Cloudfront Distribution
          assign({
            DomainName: pipe([
              get("FunctionUrl"),
              callProp("replace", "https://", ""),
              callProp("replace", "/", ""),
            ]),
          }),
        ]),
        (error, params) => {
          return;
        }
      ),
      Code: pipe([
        get("Code"),
        assign({
          Data: pipe([get("Location"), fetchZip()]),
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
    omitIfEmpty(["Policy", "Layers"]),
    tap((params) => {
      assert(true);
    }),
  ]);

const compareFunction = pipe([
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
  }),
  tap((diff) => {
    assert(true);
  }),
]);

exports.LambdaFunction = () => ({
  type: "Function",
  package: "lambda",
  client: "Lambda",
  inferName: () => get("Configuration.FunctionName"),
  findName,
  findId,
  displayResource: () => pipe([omit(["Configuration.Code.ZipFile"])]),
  ignoreResource: () =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      get("name"),
      includes("AWSCDK"),
    ]),
  compare: compareFunction,
  managedByOther,
  omitProperties: [
    "Code",
    "Configuration.Code",
    "Configuration.CodeSize",
    "Configuration.FunctionArn",
    "Configuration.LastModified",
    "Configuration.LastUpdateStatus",
    "Configuration.LastUpdateStatusReason",
    "Configuration.LastUpdateStatusReasonCode",
    "Configuration.MasterArn",
    "Configuration.RevisionId",
    "Configuration.Role",
    "Configuration.SigningJobArn",
    "Configuration.State",
    "Configuration.StateReason",
    "Configuration.StateReasonCode",
    "Configuration.Version",
    "Configuration.VpcConfig",
    "Configuration.SigningProfileVersionArn",
    "Configuration.SigningJobArn",
    "Configuration.RuntimeVersionConfig",
    "Policy",
    "FunctionUrlConfig.CreationTime",
    "FunctionUrlConfig.LastModifiedTime",
    "FunctionUrlConfig.FunctionArn",
    "FunctionUrlConfig.FunctionUrl",
    "FunctionUrlConfig.DomainName",
  ],
  propertiesDefault: {
    Publish: true,
    Configuration: {
      Architectures: ["x86_64"],
      Description: "",
      MemorySize: 128,
      Timeout: 3,
      PackageType: "Zip",
      TracingConfig: { Mode: "PassThrough" },
      EphemeralStorage: { Size: 512 },
      SnapStart: {
        ApplyOn: "None",
        OptimizationStatus: "Off",
      },
    },
  },
  filterLive:
    ({ resource, programOptions, lives, providerConfig }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(resource.name);
          assert(live.Code.Data);
        }),
        () => live,
        when(
          get("EventInvokeConfig"),
          assign({
            EventInvokeConfig: pipe([
              get("EventInvokeConfig"),
              assign({
                DestinationConfig: pipe([
                  get("DestinationConfig"),
                  when(
                    get("OnSuccess"),
                    assign({
                      OnSuccess: pipe([
                        get("OnSuccess"),
                        assign({
                          Destination: pipe([
                            get("Destination"),
                            replaceAccountAndRegion({
                              lives,
                              providerConfig,
                            }),
                          ]),
                        }),
                      ]),
                    })
                  ),
                  when(
                    get("OnFailure"),
                    assign({
                      OnFailure: pipe([
                        get("OnFailure"),
                        assign({
                          Destination: pipe([
                            get("Destination"),
                            replaceAccountAndRegion({
                              lives,
                              providerConfig,
                            }),
                          ]),
                        }),
                      ]),
                    })
                  ),
                ]),
              }),
            ]),
          })
        ),
        assign({
          Configuration: pipe([
            get("Configuration"),
            omit(["CodeSha256"]),
            unless(
              pipe([get("Layers"), isEmpty]),
              assign({
                Layers: pipe([
                  get("Layers"),
                  map(
                    replaceWithName({
                      groupType: "Lambda::Layer",
                      path: "live.LayerVersionArn",
                      pathLive: "live.LayerVersionArn",
                      providerConfig,
                      lives,
                    })
                  ),
                ]),
              })
            ),
            when(
              get("FileSystemConfigs"),
              assign({
                FileSystemConfigs: pipe([
                  get("FileSystemConfigs"),
                  map(
                    assign({
                      Arn: pipe([
                        get("Arn"),
                        replaceWithName({
                          groupType: "EFS::AccessPoint",
                          path: "id",
                          providerConfig,
                          lives,
                        }),
                      ]),
                    })
                  ),
                ]),
              })
            ),
            when(
              get("Environment"),
              assign({
                Environment: pipe([
                  get("Environment"),
                  assign({
                    Variables: pipe([
                      get("Variables"),
                      map(replaceEnv({ lives, providerConfig })),
                    ]),
                  }),
                ]),
              })
            ),
          ]),
        }),
        omitIfEmpty(["FunctionUrlConfig"]),
        tap(
          pipe([
            () => new AdmZip(Buffer.from(live.Code.Data, "base64")),
            (zip) =>
              zip.extractAllTo(
                path.resolve(programOptions.workingDirectory, resource.name),
                true
              ),
          ])
        ),
      ])(),
  // TODO SigningJobArn
  dependencies: {
    ...buildEventInvokeConfigDependencies(),
    layers: {
      type: "Layer",
      group: "Lambda",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("Configuration.Layers"),
          (layersArn) =>
            pipe([
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
        ]),
    },
    role: {
      type: "Role",
      group: "IAM",
      dependencyId: () => get("Configuration.Role"),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyId: () => get("Configuration.KMSKeyArn"),
    },
    subnets: {
      type: "Subnet",
      group: "EC2",
      list: true,
      dependencyIds: () => get("Configuration.VpcConfig.SubnetIds"),
    },
    securityGroups: {
      type: "SecurityGroup",
      group: "EC2",
      list: true,
      dependencyIds: () => get("Configuration.VpcConfig.SecurityGroupIds"),
    },
    s3Buckets: {
      type: "Bucket",
      group: "S3",
      parent: true,
      list: true,
      ignoreOnDestroy: true,
    },
    efsAccessPoints: {
      type: "AccessPoint",
      group: "EFS",
      list: true,
      dependencyIds: () =>
        pipe([get("Configuration.FileSystemConfigs"), pluck("Arn")]),
    },
    ...buildDependenciesFromEnv({
      pathEnvironment: "Configuration.Environment.Variables",
    }),
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#getFunction-property
  getById: {
    method: "getFunction",
    //getField: "MyResource",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#listFunctions-property
  getList: {
    method: "listFunctions",
    getParam: "Functions",
    decorate: ({ getById }) =>
      pipe([
        ({ FunctionArn }) => ({ Configuration: { FunctionArn } }),
        getById,
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createMyResource-property
  create: {
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
    isInstanceUp: pipe([
      and([
        pipe([get("Configuration.State"), isIn(["Active"])]),
        switchCase([
          get("FunctionUrlConfig"),
          get("FunctionUrlConfig.DomainName"),
          () => true,
        ]),
      ]),
    ]),
    isInstanceError: pipe([get("Configuration.State"), isIn(["Failed"])]),
    getErrorMessage: get("Configuration.StateReason", "failed"),
    shouldRetryOnExceptionMessages: [
      "Lambda was unable to configure access to your environment variables because the KMS key is invalid for CreateGrant.",
      "The role defined for the function cannot be assumed by Lambda",
      "EFS file system",
      "The provided execution role does not have permissions to call CreateNetworkInterface on EC2",
    ],
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#createFunctionUrlConfig-property
    postCreate: ({
      endpoint,
      payload: {
        Configuration: { FunctionName },
        FunctionUrlConfig,
        EventInvokeConfig,
      },
    }) =>
      pipe([
        tap((params) => {
          assert(endpoint);
          assert(FunctionName);
        }),
        when(
          () => FunctionUrlConfig,
          pipe([
            () => FunctionUrlConfig,
            defaultsDeep({ FunctionName }),
            endpoint().createFunctionUrlConfig,
          ])
        ),
        when(
          () => EventInvokeConfig,
          pipe([
            () => EventInvokeConfig,
            defaultsDeep({ FunctionName }),
            endpoint().putFunctionEventInvokeConfig,
          ])
        ),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#updateMyResource-property
  update:
    ({ endpoint }) =>
    ({ name, payload, diff, live }) =>
      pipe([
        tap(() => {
          logger.info(`update function: ${name}`);
          assert(diff);
        }),
        () => ({
          FunctionName: payload.Configuration.FunctionName,
          ZipFile: payload.Configuration.Code.ZipFile,
          Publish: true,
        }),
        // updateFunctionConfiguration
        endpoint().updateFunctionCode,
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
              endpoint().getFunction,
              tap((params) => {
                assert(true);
              }),
              eq(get("Configuration.LastUpdateStatus"), "Successful"),
            ]),
          }),
        // updateFunctionConfiguration
        when(
          () => get("liveDiff.updated.Configuration")(diff),
          pipe([
            () => payload,
            get("Configuration"),
            endpoint().updateFunctionConfiguration,
            tap(() => {
              logger.info(`updated function done ${name}`);
            }),
          ])
        ),
        // putFunctionEventInvokeConfig
        when(
          () => get("liveDiff.updated.EventInvokeConfig")(diff),
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => ({
              FunctionName: payload.Configuration.FunctionName,
              ...payload.EventInvokeConfig,
            }),
            endpoint().putFunctionEventInvokeConfig,
          ])
        ),
        // updateFunctionUrlConfig
        when(
          () => get("liveDiff.updated.FunctionUrlConfig")(diff),
          pipe([
            tap((params) => {
              assert(true);
            }),
            () => ({
              FunctionName: payload.Configuration.FunctionName,
              ...payload.FunctionUrlConfig,
            }),
            endpoint().updateFunctionUrlConfig,
          ])
        ),
        tap(() => {
          logger.info(`updated function done ${name}`);
        }),
      ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#deleteFunction-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap(
        pipe([
          when(
            get("FunctionUrlConfig"),
            pipe([
              get("Configuration"),
              pick(["FunctionName"]),
              endpoint().deleteFunctionUrlConfig,
            ])
          ),
        ])
      ),
    pickId,
    method: "deleteFunction",
    shouldRetryOnExceptionMessages: [
      "Please see our documentation for Deleting Lambda@Edge Functions and Replicas",
    ],
    configIsDown: { retryCount: 40 * 12, retryDelay: 5e3 },
  },
  getByName: ({ getById }) =>
    pipe([
      ({ name }) => ({ Configuration: { FunctionArn: name } }),
      getById({}),
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { role, kmsKey, subnets, securityGroups },
    programOptions,
    config,
  }) =>
    pipe([
      tap(() => {
        assert(programOptions);
        assert(role, "missing role dependencies");
      }),
      () => ({
        localPath: path.resolve(programOptions.workingDirectory, name),
      }),
      createZipBuffer,
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
              Configuration: {
                VpcConfig: {
                  SubnetIds: pipe([
                    () => subnets,
                    map((subnet) => getField(subnet, "SubnetId")),
                  ])(),
                },
              },
            })
          ),
          when(
            () => securityGroups,
            defaultsDeep({
              Configuration: {
                VpcConfig: {
                  SecurityGroupIds: pipe([
                    () => securityGroups,
                    map((sg) => getField(sg, "GroupId")),
                  ])(),
                },
              },
            })
          ),
        ])(),
    ])(),
});

const filterFunctionUrlConfig = pipe([
  get("FunctionUrlConfig"),
  omit([
    "CreationTime",
    "LastModifiedTime",
    "FunctionArn",
    "FunctionUrl",
    "DomainName",
  ]),
]);

exports.filterFunctionUrlConfig = filterFunctionUrlConfig;
