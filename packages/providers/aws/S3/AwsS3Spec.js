const assert = require("assert");
const { tap, pipe, assign, map, omit, pick, get } = require("rubico");
const { when, isEmpty } = require("rubico/x");

const mime = require("mime-types");

const { compare, omitIfEmpty } = require("@grucloud/core/Common");

const { AwsS3Bucket } = require("./AwsS3Bucket");
const { AwsS3Object, compareS3Object } = require("./AwsS3Object");
const { isOurMinion } = require("../AwsCommon");

const GROUP = "S3";

const objectFileNameFromLive = ({
  live: { Bucket, Key, ContentType },
  commandOptions,
}) => `s3/${Bucket}/${Key}.${mime.extension(ContentType)}`;

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Bucket",
      Client: AwsS3Bucket,
      isOurMinion,
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
          omit([
            "Bucket",
            "ACL", //TODO
            "Tags",
          ]),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
          omit([
            "Name",
            "CreationDate",
            "Tags",
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
      filterLive: () =>
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
          //TODO REMOVE omitIfEmpty(["LocationConstraint"])
          when(
            pipe([get("LocationConstraint"), isEmpty]),
            omit(["LocationConstraint"])
          ),
          omit(["WebsiteConfiguration.RoutingRules"]),
        ]),
    },
    {
      type: "Object",
      dependsOn: ["S3::Bucket"],
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
      dependencies: () => ({
        bucket: { type: "Bucket", group: "S3" },
      }),
    },
  ]);
