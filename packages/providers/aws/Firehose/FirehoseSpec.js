const assert = require("assert");
const { map, pipe, tap, assign, eq, get, omit, switchCase } = require("rubico");
const { defaultsDeep, size, when, find, identity } = require("rubico/x");
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
        kinesisStream: { type: "Stream", group: "Kinesis" },
        s3BucketDestination: {
          type: "Bucket",
          group: "S3",
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                () => resource,
                tap((params) => {
                  assert(dependency);
                }),
                get("live.Destinations"),
                find(
                  pipe([
                    eq(
                      get("S3DestinationDescription.BucketARN"),
                      `arn:aws:s3:::${dependency.live.Name}`
                    ),
                  ])
                ),
              ])(),
        },
        s3BucketBackup: {
          type: "Bucket",
          group: "S3",
          filterDependency:
            ({ resource }) =>
            (dependency) =>
              pipe([
                () => resource,
                tap((params) => {
                  assert(dependency);
                }),
                get("live.Destinations"),
                tap((params) => {
                  assert(true);
                }),
                find(
                  pipe([
                    eq(
                      get(
                        "ExtendedS3DestinationDescription.S3BackupDescription.BucketARN"
                      ),
                      `arn:aws:s3:::${dependency.live.Name}`
                    ),
                  ])
                ),
                tap((params) => {
                  assert(true);
                }),
              ])(),
        },
        kmsKey: { type: "Key", group: "KMS" },
        lambdaFunction: { type: "Function", group: "Lambda" },
        cloudWatchLogStreams: {
          type: "LogStream",
          group: "CloudWatchLogs",
          list: true,
        },
        cloudWatchLogStreamLogError: {
          type: "LogStream",
          group: "CloudWatchLogs",
        },
        roles: { type: "Role", group: "IAM", list: true },
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
