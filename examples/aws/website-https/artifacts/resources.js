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
        },
        TrustedKeyGroups: {
          Enabled: false,
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
            Id: "S3-cloudfront.aws.test.grucloud.org",
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
      ViewerCertificate: {
        CloudFrontDefaultCertificate: false,
        SSLSupportMethod: "sni-only",
        MinimumProtocolVersion: "TLSv1.2_2019",
        CertificateSource: "acm",
      },
    }),
    dependencies: ({}) => ({
      buckets: ["cloudfront.aws.test.grucloud.org"],
      certificate: "cloudfront.aws.test.grucloud.org",
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    name: "cloudfront.aws.test.grucloud.org.",
    dependencies: ({}) => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: ({}) => ({
      hostedZone: "cloudfront.aws.test.grucloud.org.",
      certificate: "cloudfront.aws.test.grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: ({}) => ({
      hostedZone: "cloudfront.aws.test.grucloud.org.",
      distribution: "S3-cloudfront.aws.test.grucloud.org",
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
        ErrorDocument: {
          Key: "error.html",
        },
        IndexDocument: {
          Suffix: "index.html",
        },
      },
    }),
  },
  {
    type: "Object",
    group: "S3",
    name: "build/bundle.css",
    properties: ({}) => ({
      ContentType: "text/css",
      source: "s3/cloudfront.aws.test.grucloud.org/build/bundle.css",
    }),
    dependencies: ({}) => ({
      bucket: "cloudfront.aws.test.grucloud.org",
    }),
  },
  {
    type: "Object",
    group: "S3",
    name: "build/bundle.js",
    properties: ({}) => ({
      ContentType: "application/javascript",
      source: "s3/cloudfront.aws.test.grucloud.org/build/bundle.js",
    }),
    dependencies: ({}) => ({
      bucket: "cloudfront.aws.test.grucloud.org",
    }),
  },
  {
    type: "Object",
    group: "S3",
    name: "favicon.png",
    properties: ({}) => ({
      ContentType: "image/png",
      source: "s3/cloudfront.aws.test.grucloud.org/favicon.png",
    }),
    dependencies: ({}) => ({
      bucket: "cloudfront.aws.test.grucloud.org",
    }),
  },
  {
    type: "Object",
    group: "S3",
    name: "global.css",
    properties: ({}) => ({
      ContentType: "text/css",
      source: "s3/cloudfront.aws.test.grucloud.org/global.css",
    }),
    dependencies: ({}) => ({
      bucket: "cloudfront.aws.test.grucloud.org",
    }),
  },
  {
    type: "Object",
    group: "S3",
    name: "index.html",
    properties: ({}) => ({
      ContentType: "text/html",
      source: "s3/cloudfront.aws.test.grucloud.org/index.html",
    }),
    dependencies: ({}) => ({
      bucket: "cloudfront.aws.test.grucloud.org",
    }),
  },
];
