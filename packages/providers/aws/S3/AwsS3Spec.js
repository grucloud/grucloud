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
  assignPolicyAccountAndRegion,
} = require("../AwsCommon");

const GROUP = "S3";

const compareS3 = compareAws({
  getTargetTags: () => [],
  getLiveTags: () => [],
});

const objectFileNameFromLive = ({
  live: { Bucket, Key, ContentType },
  commandOptions,
}) =>
  pipe([
    tap((params) => {
      assert(Bucket);
      assert(Key);
    }),
    //() => `s3/${Bucket}/${Key}.${mime.extension(ContentType)}`,
    () => `s3/${Bucket}/${Key}`,
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
                  (id) =>
                    lives.getById({
                      id,
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
              "Name",
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
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          tap((params) => {
            assert(lives);
          }),
          pick([
            "AccelerateConfiguration",
            "ACL",
            "CORSConfiguration",
            "ServerSideEncryptionConfiguration",
            "BucketLoggingStatus",
            "NotificationConfiguration",
            "Policy",
            //"PolicyStatus",
            "ReplicationConfiguration",
            "RequestPaymentConfiguration",
            "VersioningConfiguration",
            "LifecycleConfiguration",
            "WebsiteConfiguration",
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
      compare: compareS3Object,
      ignoreResource: () =>
        or([
          pipe([get("live.Bucket"), ignoreBuckets]),
          pipe([get("name"), ignoreObjects]),
        ]),
      filterLive: ({ commandOptions, programOptions, resource: { live } }) =>
        pipe([
          pick(["ContentType", "ServerSideEncryption", "StorageClass"]),
          assign({
            source: () =>
              objectFileNameFromLive({
                live,
                commandOptions,
                programOptions,
              }),
          }),
        ]),
    },
  ],
  map(defaultsDeep({ group: GROUP, isOurMinion })),
]);
