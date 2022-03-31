const assert = require("assert");
const { pipe, assign, map, omit, tap, pick, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const AdmZip = require("adm-zip");
const path = require("path");

const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");
const { compareAws, isOurMinionObject } = require("../AwsCommon");

const { Function, compareFunction } = require("./Function");
const { Layer, compareLayer } = require("./Layer");
const { EventSourceMapping } = require("./EventSourceMapping");

const GROUP = "Lambda";
const compareLambda = compareAws({});

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
            tap((params) => {
              assert(true);
            }),
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
      omitProperties: [
        "CodeSha256",
        "Code",
        "CodeSize",
        "FunctionArn",
        "FunctionName",
        "LastModified",
        "LastUpdateStatus",
        "LastUpdateStatusReason",
        "LastUpdateStatusReasonCode",
        "Layers",
        "MasterArn",
        "RevisionId",
        "Role",
        "SigningJobArn",
        "State",
        "StateReason",
        "StateReasonCode",
        "Version",
        "VpcConfig",
      ],
      propertiesDefault: {
        Architectures: ["x86_64"],
        Description: "",
        MemorySize: 128,
        Timeout: 3,
        TracingConfig: { Mode: "PassThrough" },
        EphemeralStorage: { Size: 512 },
      },
      filterLive:
        ({ resource, programOptions, lives }) =>
        (live) =>
          pipe([
            tap(() => {
              assert(resource.name);
              assert(live.Code.Data);
            }),
            () => live,
            get("Configuration"),
            assign({
              Environment: pipe([
                get("Environment"),
                assign({
                  Variables: pipe([
                    get("Variables"),
                    map((value) =>
                      pipe([
                        () => ({ Id: value, lives }),
                        replaceWithName({
                          groupType: "AppSync::GraphqlApi",
                          pathLive: "live.uris.GRAPHQL",
                          path: "live.uris.GRAPHQL",
                        }),
                      ])()
                    ),
                  ]),
                }),
              ]),
            }),
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
        subnets: { type: "Subnet", group: "EC2", list: true },
        graphqlApi: { type: "GraphqlApi", group: "AppSync" },
        dynamoDbTable: { type: "Table", group: "DynamoDB" },
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
