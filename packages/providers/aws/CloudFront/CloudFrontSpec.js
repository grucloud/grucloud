const assert = require("assert");
const {
  pipe,
  tap,
  assign,
  map,
  pick,
  get,
  filter,
  eq,
  switchCase,
  omit,
} = require("rubico");
const { isEmpty, find, when, first } = require("rubico/x");
const {
  buildGetId,
  replaceWithName,
  omitIfEmpty,
} = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({
  prefix: "CloudFrontDistribution",
});

const { isOurMinion, compareAws } = require("../AwsCommon");
const { CloudFrontDistribution } = require("./CloudFrontDistribution");
const {
  CloudFrontOriginAccessIdentity,
} = require("./CloudFrontOriginAccessIdentity");
const { CloudFrontCachePolicy } = require("./CloudFrontCachePolicy");
const { CloudFrontFunction } = require("./CloudFrontFunction");

const GROUP = "CloudFront";
const compareCloudFront = compareAws({});

const replaceWithBucketName = replaceWithName({ groupType: "S3::Bucket" });

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Distribution",
      dependencies: {
        buckets: { type: "Bucket", group: "S3", list: true },
        certificate: { type: "Certificate", group: "ACM" },
        functions: { type: "Function", group: "CloudFront", list: true },
        originAccessIdentities: {
          type: "OriginAccessIdentity",
          group: "CloudFront",
          list: true,
        },
      },
      Client: CloudFrontDistribution,
      inferName: ({ properties }) =>
        pipe([
          () => properties,
          tap((params) => {
            assert(true);
          }),
          get("Origins.Items"),
          first,
          get("Id"),
          tap((Id) => {
            assert(Id);
            logger.debug(`CloudFrontDistribution inferName ${Id}`);
          }),
        ])(),
      isOurMinion,
      propertiesDefault: {
        OriginGroups: { Quantity: 0, Items: [] },
        CacheBehaviors: { Quantity: 0, Items: [] },
        CustomErrorResponses: { Quantity: 0, Items: [] },
        //ViewerCertificate: { CloudFrontDefaultCertificate: false },
        DefaultCacheBehavior: {
          FunctionAssociations: { Quantity: 0, Items: [] },
          LambdaFunctionAssociations: { Quantity: 0, Items: [] },
          TrustedKeyGroups: { Quantity: 0, Items: [] },
          TrustedSigners: { Quantity: 0, Items: [] },
        },
        Restrictions: { GeoRestriction: { Quantity: 0, Items: [] } },
        HttpVersion: "http2",
        IsIPV6Enabled: true,
      },
      compare: compareCloudFront({
        filterTarget: () =>
          pipe([
            get("DistributionConfig"),
            omit([
              "CallerReference",
              //"ViewerCertificate.CloudFrontDefaultCertificate",
            ]),
          ]),
        filterLive: () =>
          pipe([
            omit([
              "Id",
              "ARN",
              "Status",
              "LastModifiedTime",
              "DomainName",
              "CallerReference",
              "WebACLId",
              "AliasICPRecordals",
            ]),
          ]),
      }),
      omitProperties: [
        "ViewerCertificate.ACMCertificateArn",
        "ViewerCertificate.Certificate",
      ],
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          pick([
            "PriceClass",
            "Aliases",
            "DefaultRootObject",
            "DefaultCacheBehavior",
            "Origins",
            "Restrictions",
            "Comment",
            "Logging",
            "ViewerCertificate",
          ]),
          assign({
            Aliases: pipe([
              get("Aliases"),
              assign({
                Items: pipe([
                  get("Items"),
                  map((certificateName) =>
                    pipe([
                      () => lives,
                      filter(eq(get("groupType"), "ACM::Certificate")),
                      find(eq(get("name"), certificateName)),
                      switchCase([
                        isEmpty,
                        () => certificateName,
                        (resource) =>
                          pipe([
                            () => resource,
                            buildGetId({ path: "name" }),
                            (getId) => () => getId,
                          ])(),
                      ]),
                    ])()
                  ),
                ]),
              }),
            ]),
            Comment: ({ Comment }) =>
              replaceWithBucketName({
                lives,
                Id: Comment,
              }),
            DefaultCacheBehavior: pipe([
              get("DefaultCacheBehavior"),
              when(
                get("FunctionAssociations"),
                assign({
                  FunctionAssociations: pipe([
                    get("FunctionAssociations"),
                    assign({
                      Items: pipe([
                        get("Items"),
                        map(
                          pipe([
                            assign({
                              FunctionARN: ({ FunctionARN }) =>
                                pipe([
                                  () => ({ Id: FunctionARN, lives }),
                                  replaceWithName({
                                    groupType: "CloudFront::Function",
                                    path: "id",
                                  }),
                                  tap((params) => {
                                    assert(true);
                                  }),
                                ])(),
                            }),
                          ])
                        ),
                      ]),
                    }),
                  ]),
                })
              ),
              assign({
                TargetOriginId: ({ TargetOriginId }) =>
                  replaceWithBucketName({
                    lives,
                    Id: TargetOriginId,
                  }),
              }),
            ]),
            Origins: pipe([
              get("Origins"),
              assign({
                Items: pipe([
                  get("Items"),
                  map(
                    pipe([
                      assign({
                        CustomHeaders: pipe([
                          get("CustomHeaders"),
                          omitIfEmpty(["Items"]),
                        ]),
                        DomainName: ({ DomainName }) =>
                          replaceWithBucketName({
                            lives,
                            Id: DomainName,
                          }),
                        // Id: ({ Id }) =>
                        //   replaceWithBucketName({
                        //     lives,
                        //     Id,
                        //   }),
                        S3OriginConfig: pipe([
                          get("S3OriginConfig"),
                          when(
                            get("OriginAccessIdentity"),
                            assign({
                              OriginAccessIdentity: ({
                                OriginAccessIdentity,
                              }) =>
                                pipe([
                                  () => ({ Id: OriginAccessIdentity, lives }),
                                  tap((params) => {
                                    assert(true);
                                  }),
                                  replaceWithName({
                                    groupType:
                                      "CloudFront::OriginAccessIdentity",
                                    path: "id",
                                  }),
                                ])(),
                            })
                          ),
                        ]),
                      }),
                    ])
                  ),
                ]),
              }),
            ]),
          }),
        ]),
    },
    {
      type: "CachePolicy",
      Client: CloudFrontCachePolicy,
      omitProperties: ["CachePolicy.Id", "CachePolicy.LastModifiedTime"],
      inferName: ({ properties }) =>
        pipe([() => properties, get("CachePolicy.CachePolicyConfig.Name")])(),
      filterLive: ({ lives }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          //pick([]),
        ]),
      compare: compareCloudFront,
    },
    {
      type: "Function",
      Client: CloudFrontFunction,
      omitProperties: [
        "ETag",
        "FunctionMetadata.FunctionARN",
        "FunctionMetadata.CreatedTime",
        "FunctionMetadata.LastModifiedTime",
      ],
      inferName: ({
        properties: {
          Name,
          FunctionMetadata: { Stage },
        },
      }) => pipe([() => `${Name}::${Stage}`])(),
      filterLive: ({ lives }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          //pick([]),
        ]),
      compare: compareCloudFront,
    },
    {
      type: "OriginAccessIdentity",
      Client: CloudFrontOriginAccessIdentity,
      filterLive: ({ lives }) => pipe([pick([])]),
      compare: compareCloudFront,
    },
  ]);
