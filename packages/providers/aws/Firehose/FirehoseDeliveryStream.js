const assert = require("assert");
const {
  pipe,
  tap,
  get,
  omit,
  pick,
  eq,
  assign,
  switchCase,
  filter,
  not,
  map,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  flatten,
  identity,
  callProp,
  isEmpty,
  when,
  first,
} = require("rubico/x");
const { buildTags, compareAws } = require("../AwsCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const { Tagger, assignTags } = require("./FirehoseCommon");

const pickId = pipe([pick(["DeliveryStreamName"])]);

const bucketArnToId = pipe([callProp("replace", "arn:aws:s3:::", "")]);

const buildArn = () =>
  pipe([
    get("DeliveryStreamName"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const decorate =
  ({ endpoint }) =>
  ({ Destinations, ...other }) =>
    pipe([
      () => Destinations,
      first,
      omit(["DestinationId"]),
      when(
        get("HttpEndpointDestinationDescription"),
        assign({
          HttpEndpointDestinationConfiguration: pipe([
            get("HttpEndpointDestinationDescription"),
            ({ S3DestinationDescription, ...other }) => ({
              ...other,
              S3Configuration: S3DestinationDescription,
            }),
          ]),
        })
      ),
      omit(["HttpEndpointDestinationDescription"]),
      ({ ExtendedS3DestinationDescription, ...other }) => ({
        ...other,
        ExtendedS3DestinationConfiguration: ExtendedS3DestinationDescription,
      }),
      (Destination) => ({ ...other, ...Destination }),
      assignTags({ endpoint }),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html
exports.FirehoseDeliveryStream = ({}) => ({
  type: "DeliveryStream",
  package: "firehose",
  client: "Firehose",
  inferName: () => get("DeliveryStreamName"),
  findName: () => pipe([get("DeliveryStreamName")]),
  findId: () => pipe([get("DeliveryStreamARN")]),
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
      dependencyId: ({ lives, config }) =>
        pipe([get("S3DestinationDescription.BucketARN", ""), bucketArnToId]),
    },
    s3BucketBackup: {
      type: "Bucket",
      group: "S3",
      dependencyId: ({ lives, config }) =>
        pipe([
          get(
            "ExtendedS3DestinationDescription.S3BackupDescription.BucketARN",
            ""
          ),
          bucketArnToId,
        ]),
    },
    kmsKey: {
      type: "Key",
      group: "KMS",
      dependencyIds: () => get("DeliveryStreamEncryptionConfiguration.KeyARN"),
    },
    lambdaFunctions: {
      type: "Function",
      group: "Lambda",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("ExtendedS3DestinationConfiguration"),
          get("ProcessingConfiguration"),
          get("Processors"),
          pluck("Parameters"),
          flatten,
          filter(eq(get("ParameterName"), "LambdaArn")),
          pluck("ParameterValue"),
          map(callProp("replace", ":$LATEST", "")),
          tap((params) => {
            assert(params);
          }),
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
    // TODO Redshift
    // TODO  OpenSearch
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#describeDeliveryStream-property
  getById: {
    method: "describeDeliveryStream",
    pickId,
    getField: "DeliveryStreamDescription",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#listDeliveryStreams-property
  getList: {
    method: "listDeliveryStreams",
    getParam: "DeliveryStreamNames",
    decorate: ({ getById }) =>
      pipe([(name) => ({ DeliveryStreamName: name }), getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#createDeliveryStream-property
  create: {
    method: "createDeliveryStream",
    pickCreated: ({ payload }) => pipe([() => payload]),
    //filterParams: pipe([omit(["EnhancedMonitoring"])]),
    shouldRetryOnExceptionMessages: ["Firehose is unable to assume role"],
    isInstanceUp: eq(get("DeliveryStreamStatus"), "ACTIVE"),
    getErrorMessage: get("FailureDescription", "error"),
    // postCreate:
    //   ({ endpoint }) =>
    //   (live) =>
    //     pipe([() => live, get("Tags"), tagResource({ endpoint })({ live })])(),
  },
  update: {
    method: "updateDeliveryStream",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, omit(["Tags"])])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#deleteDeliveryStream-property
  destroy: {
    method: "deleteDeliveryStream",
    pickId,
    // AllowForceDelete ?
  },
  getByName: ({ getList, endpoint, getById }) =>
    pipe([({ name }) => ({ DeliveryStreamName: name }), getById({})]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { kinesisStream, s3BucketDestination, kmsKey },
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(() => kmsKey, defaultsDeep({})),
    ])(),
});
