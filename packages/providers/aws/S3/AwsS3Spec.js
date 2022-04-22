const assert = require("assert");
const { tap, pipe, assign, map, omit, pick, get, or } = require("rubico");
const {
  when,
  includes,
  isObject,
  callProp,
  defaultsDeep,
} = require("rubico/x");

const mime = require("mime-types");

const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");

const { AwsS3Bucket } = require("./AwsS3Bucket");
const { AwsS3Object, compareS3Object } = require("./AwsS3Object");
const {
  compareAws,
  isOurMinion,
  replaceAccountAndRegion,
  assignPolicyResource,
} = require("../AwsCommon");

const GROUP = "S3";

const compareS3 = compareAws({
  getTargetTags: () => [],
  getLiveTags: () => [],
});

const objectFileNameFromLive = ({
  live: { Bucket, Key, ContentType },
  commandOptions,
}) => `s3/${Bucket}/${Key}.${mime.extension(ContentType)}`;

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
        },
        snsTopic: { type: "Topic", group: "SNS" },
        lambdaFunction: { type: "Function", group: "Lambda" },
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
              "ServerSideEncryptionConfiguration.Rules[0].BucketKeyEnabled",
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
                              replaceAccountAndRegion({
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
                              replaceAccountAndRegion({
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
                assign({
                  Statement: pipe([
                    get("Statement"),
                    map(
                      pipe([
                        assign({
                          Principal: pipe([
                            get("Principal"),
                            when(
                              get("AWS"),
                              assign({
                                AWS: pipe([
                                  get("AWS"),
                                  when(
                                    includes(
                                      "CloudFront Origin Access Identity"
                                    ),
                                    pipe([
                                      (Principal) =>
                                        pipe([
                                          () => ({ Id: Principal, lives }),
                                          replaceWithName({
                                            groupType:
                                              "CloudFront::OriginAccessIdentity",
                                            path: "id",
                                          }),
                                        ])(),
                                    ])
                                  ),
                                ]),
                              })
                            ),
                          ]),
                        }),
                        assignPolicyResource({ providerConfig }),
                      ])
                    ),
                  ]),
                }),
              ]),
            })
          ),
        ]),
    },
    {
      type: "Object",
      dependencies: {
        bucket: { type: "Bucket", group: "S3", parent: true },
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
