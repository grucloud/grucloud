// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    properties: ({}) => ({
      DomainName: "grucloud.org",
      SubjectAlternativeNames: ["grucloud.org", "*.grucloud.org"],
    }),
  },
  {
    type: "Distribution",
    group: "CloudFront",
    properties: ({ config }) => ({
      Comment: "",
      DefaultCacheBehavior: {
        AllowedMethods: {
          CachedMethods: {
            Items: ["HEAD", "GET"],
            Quantity: 2,
          },
          Items: ["HEAD", "GET"],
          Quantity: 2,
        },
        CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
        Compress: true,
        FieldLevelEncryptionId: "",
        SmoothStreaming: false,
        TargetOriginId: `cloudfront-demo-waf.grucloud.org.s3-website-${config.region}.amazonaws.com`,
        TrustedKeyGroups: {
          Enabled: false,
        },
        TrustedSigners: {
          Enabled: false,
        },
        ViewerProtocolPolicy: "allow-all",
      },
      DefaultRootObject: "",
      Origins: {
        Items: [
          {
            ConnectionAttempts: 3,
            ConnectionTimeout: 10,
            CustomHeaders: {
              Quantity: 0,
            },
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginKeepaliveTimeout: 5,
              OriginProtocolPolicy: "http-only",
              OriginReadTimeout: 30,
              OriginSslProtocols: {
                Items: ["TLSv1.2"],
                Quantity: 1,
              },
            },
            DomainName: `cloudfront-demo-waf.grucloud.org.s3-website-${config.region}.amazonaws.com`,
            Id: `cloudfront-demo-waf.grucloud.org.s3-website-${config.region}.amazonaws.com`,
            OriginAccessControlId: "",
            OriginPath: "",
            OriginShield: {
              Enabled: false,
            },
          },
        ],
      },
      PriceClass: "PriceClass_100",
      ViewerCertificate: {
        CertificateSource: "acm",
        CloudFrontDefaultCertificate: false,
        MinimumProtocolVersion: "TLSv1.2_2021",
        SSLSupportMethod: "sni-only",
      },
    }),
    dependencies: ({}) => ({
      buckets: ["cloudfront-demo-waf.grucloud.org"],
      certificate: "grucloud.org",
      webAcl: "cloudfront-acl",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({}) => ({
      Name: "cloudfront-demo-waf.grucloud.org",
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
            BucketKeyEnabled: true,
          },
        ],
      },
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
    type: "WebACLCloudFront",
    group: "WAFv2",
    properties: ({}) => ({
      Capacity: 0,
      DefaultAction: {
        Allow: {},
      },
      ManagedByFirewallManager: false,
      Name: "cloudfront-acl",
      Rules: [],
      Scope: "CLOUDFRONT",
      VisibilityConfig: {
        CloudWatchMetricsEnabled: true,
        MetricName: "cloudfront-acl",
        SampledRequestsEnabled: true,
      },
    }),
  },
];
