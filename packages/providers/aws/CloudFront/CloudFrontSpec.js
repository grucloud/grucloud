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
const {
  isEmpty,
  find,
  when,
  first,
  last,
  pluck,
  callProp,
  includes,
} = require("rubico/x");
const {
  buildGetId,
  replaceWithName,
  omitIfEmpty,
} = require("@grucloud/core/Common");

const logger = require("@grucloud/core/logger")({
  prefix: "CloudFrontDistribution",
});

const { isOurMinion, compareAws, replaceRegion } = require("../AwsCommon");
const { CloudFrontDistribution } = require("./CloudFrontDistribution");
const {
  CloudFrontOriginAccessIdentity,
} = require("./CloudFrontOriginAccessIdentity");
const { CloudFrontCachePolicy } = require("./CloudFrontCachePolicy");
const { CloudFrontFunction } = require("./CloudFrontFunction");

const GROUP = "CloudFront";
const compareCloudFront = compareAws({});

const replaceWithBucketName = ({ providerConfig, lives }) =>
  replaceWithName({
    groupType: "S3::Bucket",
    providerConfig,
    lives,
  });

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "Distribution",
      dependencies: {
        buckets: {
          type: "Bucket",
          group: "S3",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("Origins.Items", []),
              pluck("DomainName"),
              map((domainName) =>
                pipe([
                  () =>
                    lives.getByType({
                      type: "Bucket",
                      group: "S3",
                      providerName: config.providerName,
                    }),
                  find(({ id }) => pipe([() => domainName, includes(id)])()),
                  get("id"),
                ])()
              ),
            ]),
        },
        certificate: {
          type: "Certificate",
          group: "ACM",
          dependencyId: ({ lives, config }) =>
            get("ViewerCertificate.ACMCertificateArn"),
        },
        functions: {
          type: "Function",
          group: "CloudFront",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("DefaultCacheBehavior.FunctionAssociations.Items", []),
              pluck("FunctionARN"),
            ]),
        },
        originAccessIdentities: {
          type: "OriginAccessIdentity",
          group: "CloudFront",
          list: true,
          dependencyIds: ({ lives, config }) =>
            pipe([
              get("Origins.Items", []),
              pluck("S3OriginConfig"),
              pluck("OriginAccessIdentity"),
              map(
                pipe([
                  callProp("split", "/"),
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
        webAcl: {
          type: "WebACLCloudFront",
          group: "WAFv2",
          dependencyId: ({ lives, config }) => get("WebACLId"),
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
              "AliasICPRecordals",
            ]),
            omitIfEmpty(["WebACLId"]),
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
                            buildGetId({ path: "name", providerConfig }),
                            (getId) => () => getId,
                          ])(),
                      ]),
                    ])()
                  ),
                ]),
              }),
            ]),
            Comment: pipe([
              get("Comment"),
              replaceWithBucketName({ providerConfig, lives }),
            ]),
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
                              FunctionARN: pipe([
                                get("FunctionARN"),
                                replaceWithName({
                                  groupType: "CloudFront::Function",
                                  path: "id",
                                  providerConfig,
                                  lives,
                                }),
                              ]),
                            }),
                          ])
                        ),
                      ]),
                    }),
                  ]),
                })
              ),
              assign({
                TargetOriginId: pipe([
                  get("TargetOriginId"),
                  replaceRegion({ providerConfig }),
                ]),
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
                        Id: pipe([
                          get("Id"),
                          replaceRegion({ providerConfig }),
                        ]),
                        CustomHeaders: pipe([
                          get("CustomHeaders"),
                          omitIfEmpty(["Items"]),
                        ]),
                        DomainName: pipe([
                          get("DomainName"),
                          replaceRegion({ providerConfig }),
                        ]),
                        S3OriginConfig: pipe([
                          get("S3OriginConfig"),
                          when(
                            get("OriginAccessIdentity"),
                            assign({
                              OriginAccessIdentity: pipe([
                                get("OriginAccessIdentity"),
                                replaceWithName({
                                  groupType: "CloudFront::OriginAccessIdentity",
                                  path: "id",
                                  providerConfig,
                                  lives,
                                }),
                              ]),
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
