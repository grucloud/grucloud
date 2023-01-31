const assert = require("assert");
const {
  pipe,
  assign,
  map,
  omit,
  tap,
  pick,
  get,
  switchCase,
  any,
  and,
  eq,
  fork,
  filter,
} = require("rubico");
const { defaultsDeep, when, includes, pluck, prepend } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const AdmZip = require("adm-zip");
const path = require("path");
const os = require("os");

const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");
const {
  compareAws,
  isOurMinionObject,
  replaceEnv,
  buildDependenciesFromEnv,
} = require("../AwsCommon");

const {
  Function,
  compareFunction,
  filterFunctionUrlConfig,
  removeVersion,
} = require("./Function");
const { Layer, compareLayer } = require("./Layer");
const { LambdaPermission } = require("./LambdaPermission");

const { EventSourceMapping } = require("./EventSourceMapping");
const logger = require("@grucloud/core/logger")({ prefix: "Lambda" });

const GROUP = "Lambda";
const compare = compareAws({});

const createTempDir = () => os.tmpdir();

const omitDestinationConfig = when(
  get("DestinationConfig.OnFailure"),
  omit(["DestinationConfig"])
);

const dependencyIdEventSource =
  ({ type, group }) =>
  ({ lives, config }) =>
    pipe([
      get("EventSourceArn"),
      lives.getById({
        providerName: config.providerName,
        type,
        group,
      }),
      get("id"),
    ]);

module.exports = pipe([
  () => [
    {
      type: "Layer",
      Client: Layer,
      inferName: () => get("LayerName"),
      compare: compareLayer,
      displayResource: () => pipe([omit(["Content.Data", "Content.ZipFile"])]),
      filterLive:
        ({ resource, programOptions }) =>
        (live) =>
          pipe([
            tap(() => {
              assert(resource.name);
              assert(live.Content.Data);
            }),
            () => live,
            pick([
              "LayerName",
              "Description",
              "CompatibleRuntimes",
              "LicenseInfo",
            ]),
            tap(
              pipe([
                fork({
                  zip: () =>
                    new AdmZip(Buffer.from(live.Content.Data, "base64")),
                  zipFile: () =>
                    path.resolve(createTempDir(), `${resource.name}.zip`),
                }),
                tap(({ zipFile }) => {
                  logger.debug(`zip written to`, zipFile);
                }),
                ({ zip, zipFile }) => zip.writeZip(zipFile),
              ])
            ),
            tap(
              pipe([
                () => new AdmZip(Buffer.from(live.Content.Data, "base64")),
                (zip) =>
                  zip.extractAllTo(
                    path.resolve(
                      programOptions.workingDirectory,
                      resource.name
                    ),
                    true
                  ),
              ])
            ),
          ])(),
    },
    {
      type: "Function",
      Client: Function,
      compare: compareFunction,
      inferName: () => get("Configuration.FunctionName"),
      displayResource: () => pipe([omit(["Code.Data", "Code.ZipFile"])]),
      ignoreResource: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          get("name"),
          includes("AWSCDK"),
        ]),
      omitProperties: [
        "Code",
        "Configuration.CodeSha256",
        "Configuration.Code",
        "Configuration.CodeSize",
        "Configuration.FunctionArn",
        "Configuration.LastModified",
        "Configuration.LastUpdateStatus",
        "Configuration.LastUpdateStatusReason",
        "Configuration.LastUpdateStatusReasonCode",
        "Configuration.Layers",
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
        "Policy",
      ],
      propertiesDefault: {
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
            assign({
              FunctionUrlConfig: filterFunctionUrlConfig,
              Configuration: pipe([
                get("Configuration"),
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
            // when(
            //   get("Policy"),
            //   assign({
            //     Policy: pipe([
            //       get("Policy"),
            //       assignPolicyAccountAndRegion({ providerConfig, lives }),
            //     ]),
            //   })
            // ),
            omitIfEmpty(["FunctionUrlConfig"]),
            tap(
              pipe([
                () => new AdmZip(Buffer.from(live.Code.Data, "base64")),
                (zip) =>
                  zip.extractAllTo(
                    path.resolve(
                      programOptions.workingDirectory,
                      resource.name
                    ),
                    true
                  ),
              ])
            ),
          ])(),
      // TODO SigningJobArn
      dependencies: {
        layers: {
          type: "Layer",
          group: "Lambda",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("Configuration.Layers"),
              pluck("Arn"),
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
    },
    createAwsService(LambdaPermission({})),
    {
      type: "EventSourceMapping",
      Client: EventSourceMapping,
      inferName:
        ({ dependenciesSpec: { lambdaFunction, sqsQueue, kinesisStream } }) =>
        () =>
          pipe([
            tap((params) => {
              assert(lambdaFunction);
              assert(sqsQueue || kinesisStream);
            }),
            switchCase([
              () => sqsQueue,
              () => sqsQueue,
              () => kinesisStream,
              () => kinesisStream,
              () => {
                assert(false, `missing EventSourceMapping dependency`);
              },
            ]),
            prepend(`mapping::${lambdaFunction}::`),
          ])(),
      omitProperties: [
        "EventSourceArn",
        "UUID",
        "FunctionArn",
        "LastModified",
        "LastProcessingResult",
        "StateTransitionReason",
        "State",
      ],
      compare: compare({
        filterTarget: () =>
          pipe([
            defaultsDeep({
              BatchSize: 10,
              MaximumBatchingWindowInSeconds: 0,
              FunctionResponseTypes: [],
            }),
            omit(["FunctionName"]),
            omitIfEmpty(["FunctionResponseTypes"]),
          ]),
        filterLive: () =>
          pipe([
            omitIfEmpty([
              "StartingPosition",
              "StartingPositionTimestamp",
              //"ParallelizationFactor",
              //"BisectBatchOnFunctionError",
              //"MaximumRetryAttempts",
              //"TumblingWindowInSeconds",
              "FunctionResponseTypes",
            ]),
            omitDestinationConfig,
          ]),
      }),
      filterLive:
        ({ resource }) =>
        (live) =>
          pipe([
            tap(() => {}),
            () => live,
            omitIfEmpty(["FunctionResponseTypes"]),
            omitDestinationConfig,
          ])(),
      dependencies: {
        lambdaFunction: {
          type: "Function",
          group: "Lambda",
          parent: true,
          dependencyId: ({ lives, config }) => pipe([get("FunctionArn")]),
        },
        sqsQueue: {
          type: "Queue",
          group: "SQS",
          dependencyId: dependencyIdEventSource({
            type: "Queue",
            group: "SQS",
          }),
        },
        kinesisStream: {
          type: "Stream",
          group: "Kinesis",
          dependencyId: dependencyIdEventSource({
            type: "Stream",
            group: "Kinesis",
          }),
        },
        //TODO other event source
        /*
  Amazon DynamoDB Streams
Amazon MQ and RabbitMQ
Amazon MSK
Apache Kafka
*/
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
