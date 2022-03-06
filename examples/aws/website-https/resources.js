// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    name: "cloudfront.aws.test.grucloud.org",
  },
  {
    type: "Distribution",
    group: "CloudFront",
    name: "distribution-cloudfront.aws.test.grucloud.org",
    properties: ({ getId }) => ({
      PriceClass: "PriceClass_100",
      Aliases: {
        Quantity: 1,
        Items: [
          getId({
            type: "Certificate",
            group: "ACM",
            name: "cloudfront.aws.test.grucloud.org",
            path: "name",
          }),
        ],
      },
      DefaultRootObject: "index.html",
      DefaultCacheBehavior: {
        TargetOriginId: `S3-${getId({
          type: "Bucket",
          group: "S3",
          name: "cloudfront.aws.test.grucloud.org",
          path: "name",
        })}`,
        TrustedSigners: {
          Enabled: false,
          Quantity: 0,
          Items: [],
        },
        TrustedKeyGroups: {
          Enabled: false,
          Quantity: 0,
          Items: [],
        },
        ViewerProtocolPolicy: "redirect-to-https",
        AllowedMethods: {
          Quantity: 2,
          Items: ["HEAD", "GET"],
          CachedMethods: {
            Quantity: 2,
            Items: ["HEAD", "GET"],
          },
        },
        SmoothStreaming: false,
        Compress: false,
        LambdaFunctionAssociations: {
          Quantity: 0,
          Items: [],
        },
        FunctionAssociations: {
          Quantity: 0,
          Items: [],
        },
        FieldLevelEncryptionId: "",
        ForwardedValues: {
          QueryString: false,
          Cookies: {
            Forward: "none",
          },
          Headers: {
            Quantity: 0,
          },
          QueryStringCacheKeys: {
            Quantity: 0,
          },
        },
        MinTTL: 600,
        DefaultTTL: 86400,
        MaxTTL: 31536000,
      },
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: `S3-${getId({
              type: "Bucket",
              group: "S3",
              name: "cloudfront.aws.test.grucloud.org",
              path: "name",
            })}`,
            DomainName: `${getId({
              type: "Bucket",
              group: "S3",
              name: "cloudfront.aws.test.grucloud.org",
              path: "name",
            })}.s3.amazonaws.com`,
            OriginPath: "",
            CustomHeaders: {
              Quantity: 0,
            },
            S3OriginConfig: {
              OriginAccessIdentity: "",
            },
            ConnectionAttempts: 3,
            ConnectionTimeout: 10,
            OriginShield: {
              Enabled: false,
            },
          },
        ],
      },
      Restrictions: {
        GeoRestriction: {
          RestrictionType: "none",
          Quantity: 0,
          Items: [],
        },
      },
      Comment: `${getId({
        type: "Bucket",
        group: "S3",
        name: "cloudfront.aws.test.grucloud.org",
        path: "name",
      })}.s3.amazonaws.com`,
      Logging: {
        Enabled: false,
        IncludeCookies: false,
        Bucket: "",
        Prefix: "",
      },
    }),
    dependencies: () => ({
      buckets: ["cloudfront.aws.test.grucloud.org"],
      certificate: "cloudfront.aws.test.grucloud.org",
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    name: "cloudfront.aws.test.grucloud.org.",
    dependencies: () => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: () => ({
      hostedZone: "cloudfront.aws.test.grucloud.org.",
      certificate: "cloudfront.aws.test.grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: () => ({
      hostedZone: "cloudfront.aws.test.grucloud.org.",
      distribution: "distribution-cloudfront.aws.test.grucloud.org",
    }),
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: "grucloud.org",
    readOnly: true,
  },
  {
    type: "Bucket",
    group: "S3",
    name: "cloudfront.aws.test.grucloud.org",
    properties: ({}) => ({
      ACL: "public-read",
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: "index.html",
        },
        ErrorDocument: {
          Key: "error.html",
        },
      },
    }),
  },
];
