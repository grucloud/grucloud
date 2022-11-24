const assert = require("assert");
const {
  map,
  pipe,
  tap,
  assign,
  eq,
  get,
  omit,
  switchCase,
  filter,
  not,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  flatten,
  identity,
  callProp,
  isEmpty,
  when,
} = require("rubico/x");
const { replaceWithName } = require("@grucloud/core/Common");
const { isOurMinion, compareAws } = require("../AwsCommon");
const { FirehoseDeliveryStream } = require("./FirehoseDeliveryStream");

const GROUP = "Firehose";

const tagsKey = "Tags";

const compareFirehose = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    {
      type: "DeliveryStream",
      Client: FirehoseDeliveryStream,
      inferName: () => get("DeliveryStreamName"),
      omitProperties: [],
      propertiesDefault: {},
      compare: compareAws({ filterTarget: () => pipe([omit([])]) }),
      omitProperties: [
        "CreateTimestamp",
        "DeliveryStreamARN",
        "DeliveryStreamStatus",
        "HasMoreDestinations",
        "VersionId",
        "LastUpdateTimestamp",
        "DeliveryStreamEncryptionConfiguration",
      ],
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          when(
            get("HttpEndpointDestinationConfiguration"),
            assign({
              HttpEndpointDestinationConfiguration: pipe([
                get("HttpEndpointDestinationConfiguration"),
                assign({
                  RoleARN: pipe([
                    get("RoleARN"),
                    replaceWithName({
                      groupType: "IAM::Role",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                  S3Configuration: pipe([
                    get("S3Configuration"),
                    assign({
                      RoleARN: pipe([
                        get("RoleARN"),
                        replaceWithName({
                          groupType: "IAM::Role",
                          path: "id",
                          providerConfig,
                          lives,
                        }),
                      ]),
                    }),
                  ]),
                }),
              ]),
            })
          ),
          when(
            get("ExtendedS3DestinationConfiguration"),
            assign({
              ExtendedS3DestinationConfiguration: pipe([
                get("ExtendedS3DestinationConfiguration"),
                assign({
                  ProcessingConfiguration: pipe([
                    get("ProcessingConfiguration"),
                    assign({
                      Processors: pipe([
                        get("Processors"),
                        map(
                          assign({
                            Parameters: pipe([
                              get("Parameters"),
                              map(
                                pipe([
                                  tap((params) => {
                                    assert(true);
                                  }),
                                  switchCase([
                                    eq(get("ParameterName"), "LambdaArn"),
                                    assign({
                                      ParameterValue: pipe([
                                        get("ParameterValue"),
                                        replaceWithName({
                                          groupType: "Lambda::Function",
                                          path: "id",
                                          providerConfig,
                                          lives,
                                        }),
                                      ]),
                                    }),
                                    eq(get("ParameterName"), "RoleArn"),
                                    assign({
                                      ParameterValue: pipe([
                                        get("ParameterValue"),
                                        replaceWithName({
                                          groupType: "IAM::Role",
                                          path: "id",
                                          providerConfig,
                                          lives,
                                        }),
                                      ]),
                                    }),
                                    identity,
                                  ]),
                                ])
                              ),
                            ]),
                          })
                        ),
                      ]),
                    }),
                  ]),
                  RoleARN: pipe([
                    get("RoleARN"),
                    replaceWithName({
                      groupType: "IAM::Role",
                      path: "id",
                      providerConfig,
                      lives,
                    }),
                  ]),
                }),
                when(
                  get("S3BackupDescription"),
                  assign({
                    S3BackupDescription: pipe([
                      get("S3BackupDescription"),
                      when(
                        get("RoleARN"),
                        assign({
                          RoleARN: pipe([
                            get("RoleARN"),
                            replaceWithName({
                              groupType: "IAM::Role",
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
              ]),
            })
          ),
          omit(["S3DestinationDescription"]),
        ]),
      dependencies: {
        kinesisStream: {
          type: "Stream",
          group: "Kinesis",
          dependencyId: ({ lives, config }) => get("TODO"),
        },
        s3BucketDestination: {
          type: "Bucket",
          group: "S3",
          //list: true,
          dependencyId: ({ lives, config }) =>
            pipe([get("S3DestinationDescription.BucketARN")]),
        },
        s3BucketBackup: {
          type: "Bucket",
          group: "S3",
          dependencyId: ({ lives, config }) =>
            pipe([
              get(
                "ExtendedS3DestinationDescription.S3BackupDescription.BucketARN"
              ),
            ]),
        },
        kmsKey: {
          type: "Key",
          group: "KMS",
          dependencyIds: () =>
            get("DeliveryStreamEncryptionConfiguration.KeyARN"),
        },
        lambdaFunction: {
          type: "Function",
          group: "Lambda",
          lits: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("ExtendedS3DestinationDescription"),
              pluck("ProcessingConfiguration"),
              pluck("Processors"),
              flatten,
              pluck("Parameters"),
              flatten,
              filter(eq(get("ParameterName"), "LambdaArn")),
              pluck("ParameterValue"),
              map(callProp("replace", ":$LATEST", "")),
            ]),
        },
        cloudWatchLogStreams: {
          type: "LogStream",
          group: "CloudWatchLogs",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("ExtendedS3DestinationDescription"),
              pluck("CloudWatchLoggingOptions"),
              filter(not(isEmpty)),
              map(
                pipe([
                  tap(({ LogGroupName, LogStreamName }) => {
                    assert(LogGroupName);
                    assert(LogStreamName);
                  }),
                  ({ LogGroupName, LogStreamName }) =>
                    `${LogGroupName}::${LogStreamName}`,
                  lives.getByName({
                    providerName: config.providerName,
                    type: "LogStream",
                    group: "CloudWatchLogs",
                  }),
                  get("id"),
                ])
              ),
            ]),
        },
        //TODO
        cloudWatchLogStreamLogError: {
          type: "LogStream",
          group: "CloudWatchLogs",
        },
        roles: {
          type: "Role",
          group: "IAM",
          list: true,
          dependencyIds:
            ({ lives, config }) =>
            (live) =>
              pipe([
                () => [
                  "HttpEndpointDestinationConfiguration.RoleARN",
                  "S3DestinationDescription.RoleARN",
                ],
                map((path) => get(path)(live)),
                filter(not(isEmpty)),
              ])(),
        },
        // Redshift
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      tagsKey,
      compare: compareFirehose({}),
    })
  ),
]);
