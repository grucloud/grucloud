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
} = require("rubico");
const { defaultsDeep, pluck, flatten, identity } = require("rubico/x");
const { replaceWithName, s } = require("@grucloud/core/Common");
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
      ],
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          assign({
            Destinations: pipe([
              get("Destinations"),
              map(
                assign({
                  ExtendedS3DestinationDescription: pipe([
                    get("ExtendedS3DestinationDescription"),
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
                      S3BackupDescription: pipe([
                        get("S3BackupDescription"),
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
                  S3DestinationDescription: pipe([
                    get("S3DestinationDescription"),
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
                })
              ),
            ]),
          }),
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
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("Destinations"),
              pluck("S3DestinationDescription.BucketARN"),
            ]),
        },
        s3BucketBackup: {
          type: "Bucket",
          group: "S3",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("Destinations"),
              pluck(
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
              () => live,
              get("Destinations"),
              pluck("ExtendedS3DestinationDescription"),
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
              get("Destinations"),
              pluck("ExtendedS3DestinationDescription"),
              pluck("CloudWatchLoggingOptions"),
              map(
                pipe([
                  tap(({ LogGroupName, LogStreamName }) => {
                    assert(LogGroupName);
                    assert(LogStreamName);
                  }),
                  ({ LogGroupName, LogStreamName }) =>
                    lives.getByName({
                      name: `${LogGroupName}::${LogStreamName}`,
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
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("Destinations"),
              pluck("S3DestinationDescription"),
              pluck("RoleARN"),
            ]),
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
