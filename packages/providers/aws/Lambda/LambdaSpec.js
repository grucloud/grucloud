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
} = require("rubico");
const { defaultsDeep, when, includes } = require("rubico/x");

const AdmZip = require("adm-zip");
const path = require("path");
const os = require("os");

const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");
const {
  compareAws,
  isOurMinionObject,
  replaceAccountAndRegion,
  assignPolicyAccountAndRegion,
} = require("../AwsCommon");

const {
  Function,
  compareFunction,
  filterFunctionUrlConfig,
} = require("./Function");
const { Layer, compareLayer } = require("./Layer");
const { EventSourceMapping } = require("./EventSourceMapping");
const logger = require("@grucloud/core/logger")({ prefix: "Lambda" });

const GROUP = "Lambda";
const compareLambda = compareAws({});

const hasIdInLive = ({ idToMatch, lives, groupType }) =>
  pipe([
    tap(() => {
      assert(groupType);
      assert(idToMatch);
    }),
    () => lives,
    any(
      and([
        eq(get("groupType"), groupType),
        ({ id }) => idToMatch.match(new RegExp(id)),
      ])
    ),
  ]);

const createTempDir = () => os.tmpdir();

module.exports = pipe([
  () => [
    {
      type: "Layer",
      Client: Layer,
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
        "Configuration.FunctionName",
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
                          map((value) =>
                            pipe([
                              () => value,
                              switchCase([
                                () => value.endsWith(".amazonaws.com/graphql"),
                                pipe([
                                  replaceWithName({
                                    groupType: "AppSync::GraphqlApi",
                                    pathLive: "live.uris.GRAPHQL",
                                    path: "live.uris.GRAPHQL",
                                    providerConfig,
                                    lives,
                                  }),
                                ]),
                                hasIdInLive({
                                  idToMatch: value,
                                  lives,
                                  groupType: "SecretsManager::Secret",
                                }),
                                pipe([
                                  replaceWithName({
                                    groupType: "SecretsManager::Secret",
                                    path: "id",
                                    providerConfig,
                                    lives,
                                  }),
                                ]),
                                hasIdInLive({
                                  idToMatch: value,
                                  lives,
                                  groupType: "SNS::Topic",
                                }),
                                pipe([
                                  replaceWithName({
                                    groupType: "SNS::Topic",
                                    path: "id",
                                    providerConfig,
                                    lives,
                                  }),
                                ]),
                                pipe([
                                  get("Id"),
                                  replaceAccountAndRegion({
                                    providerConfig,
                                    lives,
                                  }),
                                ]),
                              ]),
                            ])()
                          ),
                        ]),
                      }),
                    ]),
                  })
                ),
              ]),
            }),
            when(
              get("Policy"),
              assign({
                Policy: pipe([
                  get("Policy"),
                  assignPolicyAccountAndRegion({ providerConfig, lives }),
                ]),
              })
            ),
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
      dependencies: {
        layers: { type: "Layer", group: "Lambda", list: true },
        role: { type: "Role", group: "IAM" },
        kmsKey: { type: "Key", group: "KMS" },
        secret: { type: "Secret", group: "SecretsManager", parent: true },
        subnets: { type: "Subnet", group: "EC2", list: true },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
        s3Bucket: {
          type: "Bucket",
          group: "S3",
          parent: true,
          ignoreOnDestroy: true,
        },
        graphqlApi: { type: "GraphqlApi", group: "AppSync", parent: true },
        dynamoDbTable: { type: "Table", group: "DynamoDB", parent: true },
        snsTopic: { type: "Topic", group: "SNS", parent: true },
        dbCluster: { type: "DBCluster", group: "RDS", parent: true },
        efsAccessPoint: { type: "AccessPoint", group: "EFS", list: true },
        apiGatewayV2s: { type: "Api", group: "ApiGatewayV2", list: true },
        ssmParameters: { type: "Parameter", group: "SSM", list: true },
      },
    },
    {
      type: "EventSourceMapping",
      Client: EventSourceMapping,
      compare: compareLambda({
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
            omit([
              "UUID",
              "FunctionArn",
              "LastModified",
              "LastProcessingResult",
              "StateTransitionReason",
              "MaximumRecordAgeInSeconds",
              "State",
            ]),
            omitIfEmpty([
              "StartingPosition",
              "StartingPositionTimestamp",
              "ParallelizationFactor",
              "BisectBatchOnFunctionError",
              "MaximumRetryAttempts",
              "TumblingWindowInSeconds",
              "FunctionResponseTypes",
            ]),
          ]),
      }),
      filterLive:
        ({ resource }) =>
        (live) =>
          pipe([
            tap(() => {}),
            () => live,
            pick([
              "StartingPosition",
              "StartingPositionTimestamp",
              "BatchSize",
              "MaximumBatchingWindowInSeconds",
              "ParallelizationFactor",
              "DestinationConfig",
              "Topics",
              "Queues",
              "MaximumRecordAgeInSeconds",
              "BisectBatchOnFunctionError",
              "MaximumRetryAttempts",
              "TumblingWindowInSeconds",
              "FunctionResponseTypes",
            ]),
            omitIfEmpty(["FunctionResponseTypes"]),
          ])(),
      dependencies: {
        lambdaFunction: { type: "Function", group: "Lambda", parent: true },
        sqsQueue: { type: "Queue", group: "SQS" },
        //TODO other event source
        /*
  Amazon DynamoDB Streams
Amazon Kinesis
Amazon SQS
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
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.Tags, config }),
    })
  ),
]);
