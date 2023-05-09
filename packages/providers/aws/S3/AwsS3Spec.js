const assert = require("assert");
const {
  tap,
  pipe,
  assign,
  map,
  omit,
  pick,
  get,
  or,
  not,
  filter,
} = require("rubico");
const {
  when,
  includes,
  pluck,
  callProp,
  defaultsDeep,
  isEmpty,
  last,
} = require("rubico/x");

const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");

const { AwsS3Bucket } = require("./AwsS3Bucket");
const { AwsS3Object, compareS3Object } = require("./AwsS3Object");
const {
  compareAws,
  isOurMinion,
  replaceArnWithAccountAndRegion,
  replaceAccountAndRegion,
} = require("../AwsCommon");
const { assignPolicyAccountAndRegion } = require("../IAM/IAMCommon");

const GROUP = "S3";

const compareS3 = compareAws({
  getTargetTags: () => [],
  getLiveTags: () => [],
});

const objectFileNameFromLive = ({
  live: { Bucket, Key, ContentType },
  commandOptions,
  providerConfig,
}) =>
  pipe([
    tap((params) => {
      assert(Bucket);
      assert(Key);
    }),
    //() => `s3/${Bucket}/${Key}.${mime.extension(ContentType)}`,
    () => `s3/${Bucket}/${Key}`,
    replaceAccountAndRegion({ providerConfig }),
  ])();

//TODO
const ignoreBuckets = or([
  callProp("startsWith", "cdk-"),
  callProp("startsWith", "aws-sam-cli"),
]);

const ignoreObjects = or([callProp("startsWith", "AWSLogs")]);

module.exports = pipe([
  () => [
    {
      type: "Bucket",
      Client: AwsS3Bucket,
      ignoreResource: () => pipe([get("name"), ignoreBuckets]),
      dependencies: {
        originAccessIdentities: {
          type: "OriginAccessIdentity",
          group: "CloudFront",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("Policy.Statement", []),
              pluck("Principal"),
              pluck("AWS"),
              filter(not(isEmpty)),
              map(
                pipe([
                  callProp("split", " "),
                  last,
                  lives.getById({
                    type: "OriginAccessIdentity",
                    group: "CloudFront",
                    providerName: config.providerName,
                  }),
                  get("id"),
                ])
              ),
            ]),
        },
        snsTopics: {
          type: "Topic",
          group: "SNS",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("NotificationConfiguration.TopicConfigurations"),
              pluck("TopicArn"),
            ]),
        },
        lambdaFunction: {
          type: "Function",
          group: "Lambda",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("NotificationConfiguration.LambdaFunctionConfigurations"),
              pluck("LambdaFunctionArn"),
            ]),
        },
      },
      propertiesDefault: {
        ServerSideEncryptionConfiguration: {
          Rules: [
            {
              ApplyServerSideEncryptionByDefault: {
                SSEAlgorithm: "AES256",
              },
              //BucketKeyEnabled: true,
            },
          ],
        },
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          IgnorePublicAcls: true,
          BlockPublicPolicy: true,
          RestrictPublicBuckets: true,
        },
      },
      compare: compareS3({
        filterTarget: () =>
          pipe([
            omit([
              "Bucket",
              "ACL", //TODO
            ]),
          ]),
        filterLive: () =>
          pipe([
            omit([
              "Arn",
              "CreationDate",
              "LocationConstraint",
              "ACL", //TODO
              "PolicyStatus.IsPublic",
            ]),
            when(
              get("NotificationConfiguration"),
              assign({
                NotificationConfiguration: pipe([
                  get("NotificationConfiguration"),
                  when(
                    get("LambdaFunctionConfigurations"),
                    assign({
                      LambdaFunctionConfigurations: pipe([
                        get("LambdaFunctionConfigurations"),
                        map(pipe([omit(["Id"])])),
                      ]),
                    })
                  ),
                  when(
                    get("TopicConfigurations"),
                    assign({
                      TopicConfigurations: pipe([
                        get("TopicConfigurations"),
                        map(pipe([omit(["Id"])])),
                      ]),
                    })
                  ),
                ]),
              })
            ),
            omitIfEmpty([
              "AccelerateConfiguration",
              "ServerSideEncryptionConfiguration",
              "PolicyStatus",
              "RequestPaymentConfiguration",
              "BucketLoggingStatus",
              "ReplicationConfiguration",
              "LifecycleConfiguration",
              "LifecycleConfiguration.Rules[0].NoncurrentVersionTransitions",
              "CORSConfiguration.CORSRules[0].ExposeHeaders",
              "CORSConfiguration",
              "Policy",
              "WebsiteConfiguration",
              "WebsiteConfiguration.RoutingRules",
              "NotificationConfiguration",
              "VersioningConfiguration",
            ]),
          ]),
      }),
      inferName: () => get("Name"),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          tap((params) => {
            assert(lives);
          }),
          pick([
            "Name",
            "AccelerateConfiguration",
            "ACL",
            "CORSConfiguration",
            "ServerSideEncryptionConfiguration",
            "BucketLoggingStatus",
            "NotificationConfiguration",
            "PublicAccessBlockConfiguration",
            "Policy",
            //"PolicyStatus",
            "ReplicationConfiguration",
            "RequestPaymentConfiguration",
            "VersioningConfiguration",
            "LifecycleConfiguration",
            "WebsiteConfiguration",
          ]),
          assign({
            Name: pipe([
              get("Name"),
              replaceAccountAndRegion({ lives, providerConfig }),
            ]),
          }),
          when(
            get("NotificationConfiguration"),
            assign({
              NotificationConfiguration: pipe([
                get("NotificationConfiguration"),
                when(
                  get("LambdaFunctionConfigurations"),
                  assign({
                    LambdaFunctionConfigurations: pipe([
                      get("LambdaFunctionConfigurations"),
                      map(
                        pipe([
                          omit(["Id"]),
                          assign({
                            LambdaFunctionArn: pipe([
                              get("LambdaFunctionArn"),
                              replaceArnWithAccountAndRegion({
                                providerConfig,
                                lives,
                              }),
                            ]),
                          }),
                        ])
                      ),
                    ]),
                  })
                ),
                when(
                  get("TopicConfigurations"),
                  assign({
                    TopicConfigurations: pipe([
                      get("TopicConfigurations"),
                      map(
                        pipe([
                          omit(["Id"]),
                          assign({
                            TopicArn: pipe([
                              get("TopicArn"),
                              replaceArnWithAccountAndRegion({
                                providerConfig,
                                lives,
                              }),
                            ]),
                          }),
                        ])
                      ),
                    ]),
                  })
                ),
              ]),
            })
          ),
          // ReplicationConfiguration
          when(
            get("ReplicationConfiguration"),
            assign({
              ReplicationConfiguration: pipe([
                get("ReplicationConfiguration"),
                assign({
                  Role: pipe([
                    get("Role"),
                    replaceArnWithAccountAndRegion({
                      providerConfig,
                      lives,
                    }),
                  ]),
                }),
              ]),
            })
          ),
          omitIfEmpty(["LocationConstraint"]),
          omit(["WebsiteConfiguration.RoutingRules"]),
          when(
            get("Policy"),
            assign({
              Policy: pipe([
                get("Policy"),
                assignPolicyAccountAndRegion({ providerConfig, lives }),
              ]),
            })
          ),
        ]),
    },
    {
      type: "Object",
      dependencies: {
        bucket: {
          type: "Bucket",
          group: "S3",
          parent: true,
          dependencyId: ({ lives, config }) => get("Bucket"),
        },
      },
      Client: AwsS3Object,
      inferName:
        ({ dependenciesSpec: { bucket } }) =>
        ({ Key }) =>
          pipe([
            tap((params) => {
              assert(bucket);
              assert(Key);
            }),
            () => `${bucket}/${Key}`,
          ])(),
      compare: compareS3Object,
      ignoreResource: () =>
        or([
          pipe([get("live.Bucket"), ignoreBuckets]),
          pipe([get("name"), ignoreObjects]),
        ]),
      filterLive: ({
        commandOptions,
        programOptions,
        resource: { live },
        providerConfig,
      }) =>
        pipe([
          pick(["Key", "ContentType", "ServerSideEncryption", "StorageClass"]),
          assign({
            source: () =>
              objectFileNameFromLive({
                live,
                commandOptions,
                programOptions,
                providerConfig,
              }),
          }),
        ]),
    },
  ],
  map(defaultsDeep({ group: GROUP, isOurMinion })),
]);
