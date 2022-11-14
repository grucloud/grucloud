// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    properties: ({}) => ({
      DomainName: "cloudfront-demo.grucloud.org",
    }),
  },
  {
    type: "Distribution",
    group: "CloudFront",
    properties: ({ config, getId }) => ({
      PriceClass: "PriceClass_100",
      Aliases: {
        Quantity: 1,
        Items: [
          getId({
            type: "Certificate",
            group: "ACM",
            name: "cloudfront-demo.grucloud.org",
            path: "name",
          }),
        ],
      },
      DefaultRootObject: "index.html",
      DefaultCacheBehavior: {
        TargetOriginId: `cloudfront-demo.grucloud.org.s3.${config.region}.amazonaws.com`,
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
        Compress: true,
        FieldLevelEncryptionId: "",
        CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
      },
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: `cloudfront-demo.grucloud.org.s3.${config.region}.amazonaws.com`,
            DomainName: `cloudfront-demo.grucloud.org.s3.${config.region}.amazonaws.com`,
            OriginPath: "",
            CustomHeaders: {
              Quantity: 0,
            },
            S3OriginConfig: {
              OriginAccessIdentity: `origin-access-identity/cloudfront/${getId({
                type: "OriginAccessIdentity",
                group: "CloudFront",
                name: `access-identity-cloudfront-demo.grucloud.org.s3.${config.region}.amazonaws.com`,
              })}`,
            },
            ConnectionAttempts: 3,
            ConnectionTimeout: 10,
            OriginShield: {
              Enabled: false,
            },
            OriginAccessControlId: "",
          },
        ],
      },
      Restrictions: {
        GeoRestriction: {
          RestrictionType: "none",
        },
      },
      Comment: "",
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
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: ({ config }) => ({
      buckets: ["cloudfront-demo.grucloud.org"],
      certificate: "cloudfront-demo.grucloud.org",
      originAccessIdentities: [
        `access-identity-cloudfront-demo.grucloud.org.s3.${config.region}.amazonaws.com`,
      ],
    }),
  },
  {
    type: "OriginAccessIdentity",
    group: "CloudFront",
    name: ({ config }) =>
      `access-identity-cloudfront-demo.grucloud.org.s3.${config.region}.amazonaws.com`,
  },
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "grucloud.org.",
    }),
    dependencies: ({}) => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: ({}) => ({
      hostedZone: "grucloud.org.",
      certificate: "cloudfront-demo.grucloud.org",
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
    properties: ({ config, getId }) => ({
      Name: "cloudfront-demo.grucloud.org",
      Policy: {
        Version: "2008-10-17",
        Id: "PolicyForCloudFrontPrivateContent",
        Statement: [
          {
            Sid: "1",
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${getId(
                {
                  type: "OriginAccessIdentity",
                  group: "CloudFront",
                  name: `access-identity-cloudfront-demo.grucloud.org.s3.${config.region}.amazonaws.com`,
                }
              )}`,
            },
            Action: "s3:GetObject",
            Resource: "arn:aws:s3:::cloudfront-demo.grucloud.org/*",
          },
        ],
      },
    }),
    dependencies: ({ config }) => ({
      originAccessIdentities: [
        `access-identity-cloudfront-demo.grucloud.org.s3.${config.region}.amazonaws.com`,
      ],
    }),
  },
];
