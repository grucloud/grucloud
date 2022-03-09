const assert = require("assert");
const { tap, pipe, assign, map, omit, pick, get } = require("rubico");
const { when, includes, isObject } = require("rubico/x");

const mime = require("mime-types");

const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");

const { AwsS3Bucket } = require("./AwsS3Bucket");
const { AwsS3Object, compareS3Object } = require("./AwsS3Object");
const { compareAws, isOurMinion } = require("../AwsCommon");

const GROUP = "S3";
const compareS3 = compareAws({});

const objectFileNameFromLive = ({
  live: { Bucket, Key, ContentType },
  commandOptions,
}) => `s3/${Bucket}/${Key}.${mime.extension(ContentType)}`;

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Bucket",
      Client: AwsS3Bucket,
      dependencies: {
        originAccessIdentities: {
          type: "OriginAccessIdentity",
          group: "CloudFront",
          list: true,
        },
      },
      isOurMinion,
      compare: compareS3({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit([
              "Bucket",
              "ACL", //TODO
            ]),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit([
              "Name",
              "CreationDate",
              "LocationConstraint",
              "ACL", //TODO
              "PolicyStatus.IsPublic",
              "ServerSideEncryptionConfiguration.Rules[0].BucketKeyEnabled",
            ]),
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
      filterLive: ({ lives }) =>
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
                            tap((params) => {
                              assert(true);
                            }),
                            when(
                              isObject,
                              assign({
                                AWS: pipe([
                                  tap((params) => {
                                    assert(true);
                                  }),
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
                          Resource: pipe([
                            get("Resource"),
                            tap((params) => {
                              assert(true);
                            }),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                }),
                tap((params) => {
                  assert(true);
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
      isOurMinion,
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
  ]);
