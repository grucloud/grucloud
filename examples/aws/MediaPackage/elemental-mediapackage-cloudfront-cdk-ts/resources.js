// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Distribution",
    group: "CloudFront",
    properties: ({ getId }) => ({
      DefaultRootObject: "",
      Origins: {
        Items: [
          {
            Id: "StreamingStackMyCloudFrontDistributionOrigin198011964",
            DomainName: `${getId({
              type: "OriginEndpoint",
              group: "MediaPackage",
              name: "StreamingStack-dash-",
              path: "live.DomainName",
            })}`,
            OriginPath: "",
            CustomHeaders: {
              Quantity: 1,
              Items: [
                {
                  HeaderName: "X-MediaPackage-CDNIdentifier",
                  HeaderValue: "4pq4\\%o@'u@|,<SpNq@AsEY5e(x.wd+-",
                },
              ],
            },
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginProtocolPolicy: "https-only",
              OriginSslProtocols: {
                Quantity: 1,
                Items: ["SSLv3"],
              },
              OriginReadTimeout: 30,
              OriginKeepaliveTimeout: 5,
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
      DefaultCacheBehavior: {
        TargetOriginId: "StreamingStackMyCloudFrontDistributionOrigin198011964",
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
        OriginRequestPolicyId: `${getId({
          type: "OriginRequestPolicy",
          group: "CloudFront",
          name: "StreamingStackViewer-Country-City",
        })}`,
      },
      CacheBehaviors: {
        Quantity: 3,
        Items: [
          {
            PathPattern: "*.m3u8",
            TargetOriginId:
              "StreamingStackMyCloudFrontDistributionOrigin198011964",
            TrustedSigners: {
              Enabled: false,
            },
            TrustedKeyGroups: {
              Enabled: false,
            },
            ViewerProtocolPolicy: "redirect-to-https",
            AllowedMethods: {
              Quantity: 7,
              Items: [
                "HEAD",
                "DELETE",
                "POST",
                "GET",
                "OPTIONS",
                "PUT",
                "PATCH",
              ],
              CachedMethods: {
                Quantity: 2,
                Items: ["HEAD", "GET"],
              },
            },
            SmoothStreaming: false,
            Compress: true,
            LambdaFunctionAssociations: {},
            FunctionAssociations: {},
            FieldLevelEncryptionId: "",
            CachePolicyId: "08627262-05a9-4f76-9ded-b50ca2e3a84f",
            OriginRequestPolicyId: `${getId({
              type: "OriginRequestPolicy",
              group: "CloudFront",
              name: "StreamingStackViewer-Country-City",
            })}`,
          },
          {
            PathPattern: "*.ts",
            TargetOriginId:
              "StreamingStackMyCloudFrontDistributionOrigin198011964",
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
            LambdaFunctionAssociations: {},
            FunctionAssociations: {},
            FieldLevelEncryptionId: "",
            CachePolicyId: "08627262-05a9-4f76-9ded-b50ca2e3a84f",
            OriginRequestPolicyId: `${getId({
              type: "OriginRequestPolicy",
              group: "CloudFront",
              name: "StreamingStackViewer-Country-City",
            })}`,
          },
          {
            PathPattern: "*.mpd",
            TargetOriginId:
              "StreamingStackMyCloudFrontDistributionOrigin198011964",
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
            LambdaFunctionAssociations: {},
            FunctionAssociations: {},
            FieldLevelEncryptionId: "",
            CachePolicyId: "08627262-05a9-4f76-9ded-b50ca2e3a84f",
            OriginRequestPolicyId: `${getId({
              type: "OriginRequestPolicy",
              group: "CloudFront",
              name: "StreamingStackViewer-Country-City",
            })}`,
          },
        ],
      },
      Comment: "StreamingStack - CDK deployment Secure Media Delivery",
      PriceClass: "PriceClass_All",
      ViewerCertificate: {
        CloudFrontDefaultCertificate: true,
        SSLSupportMethod: "vip",
        MinimumProtocolVersion: "TLSv1",
        CertificateSource: "cloudfront",
      },
    }),
    dependencies: ({}) => ({
      mediaPackageOriginEndpoints: ["StreamingStack-dash-"],
      originRequestPolicy: "StreamingStackViewer-Country-City",
    }),
  },
  {
    type: "OriginRequestPolicy",
    group: "CloudFront",
    properties: ({}) => ({
      OriginRequestPolicyConfig: {
        Comment: "Policy to FWD CloudFront headers",
        Name: "StreamingStackViewer-Country-City",
        HeadersConfig: {
          HeaderBehavior: "whitelist",
          Headers: {
            Quantity: 7,
            Items: [
              "CloudFront-Viewer-Address",
              "Access-Control-Request-Method",
              "CloudFront-Viewer-Country",
              "Access-Control-Request-Headers",
              "CloudFront-Viewer-City",
              "Referer",
              "User-Agent",
            ],
          },
        },
        CookiesConfig: {
          CookieBehavior: "none",
        },
        QueryStringsConfig: {
          QueryStringBehavior: "all",
        },
      },
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ getId }) => ({
      RoleName: "StreamingStack-MyMediaPackageRole2A6DBB2D-11N4MY00K42A0",
      Description: "A role to be assumed by MediaPackage",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "mediapackage.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "secretsmanager:DescribeSecret",
                  "secretsmanager:GetSecretValue",
                  "secretsmanager:ListSecretVersionIds",
                  "secretsmanager:ListSecrets",
                ],
                Resource: `${getId({
                  type: "Secret",
                  group: "SecretsManager",
                  name: "MediaPackage/StreamingStack",
                  path: "live.ARN",
                })}`,
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "policy",
        },
      ],
    }),
    dependencies: ({}) => ({
      secretsManagerSecrets: ["MediaPackage/StreamingStack"],
    }),
  },
  {
    type: "Channel",
    group: "MediaPackage",
    properties: ({}) => ({
      Description: "Channel for StreamingStack",
      Id: "StreamingStack_MediaPackageChannel",
    }),
  },
  {
    type: "OriginEndpoint",
    group: "MediaPackage",
    properties: ({}) => ({
      CmafPackage: {
        HlsManifests: [
          {
            AdMarkers: "NONE",
            AdTriggers: [
              "SPLICE_INSERT",
              "PROVIDER_ADVERTISEMENT",
              "DISTRIBUTOR_ADVERTISEMENT",
              "PROVIDER_PLACEMENT_OPPORTUNITY",
              "DISTRIBUTOR_PLACEMENT_OPPORTUNITY",
            ],
            AdsOnDeliveryRestrictions: "RESTRICTED",
            Id: "StreamingStack-cmaf-",
            IncludeIframeOnlyStream: false,
            PlaylistType: "EVENT",
            PlaylistWindowSeconds: 60,
            ProgramDateTimeIntervalSeconds: 0,
          },
        ],
        SegmentDurationSeconds: 2,
        SegmentPrefix: "segmentPrefix",
        StreamSelection: {
          MaxVideoBitsPerSecond: 2147483647,
          MinVideoBitsPerSecond: 0,
          StreamOrder: "ORIGINAL",
        },
      },
      Id: "StreamingStack-cmaf-",
    }),
    dependencies: ({}) => ({
      channel: "StreamingStack_MediaPackageChannel",
      iamRoleSecret: "StreamingStack-MyMediaPackageRole2A6DBB2D-11N4MY00K42A0",
      secretsManagerSecret: "MediaPackage/StreamingStack",
    }),
  },
  {
    type: "OriginEndpoint",
    group: "MediaPackage",
    properties: ({}) => ({
      DashPackage: {
        AdTriggers: [
          "BREAK",
          "DISTRIBUTOR_ADVERTISEMENT",
          "DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY",
          "DISTRIBUTOR_PLACEMENT_OPPORTUNITY",
          "PROVIDER_ADVERTISEMENT",
          "PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY",
          "PROVIDER_PLACEMENT_OPPORTUNITY",
          "SPLICE_INSERT",
        ],
        AdsOnDeliveryRestrictions: "RESTRICTED",
        IncludeIframeOnlyStream: false,
        ManifestLayout: "FULL",
        ManifestWindowSeconds: 60,
        MinBufferTimeSeconds: 10,
        MinUpdatePeriodSeconds: 5,
        PeriodTriggers: [],
        Profile: "NONE",
        SegmentDurationSeconds: 5,
        SegmentTemplateFormat: "TIME_WITH_TIMELINE",
        StreamSelection: {
          MaxVideoBitsPerSecond: 2147483647,
          MinVideoBitsPerSecond: 0,
          StreamOrder: "ORIGINAL",
        },
        SuggestedPresentationDelaySeconds: 20,
        UtcTiming: "NONE",
      },
      Id: "StreamingStack-dash-",
    }),
    dependencies: ({}) => ({
      channel: "StreamingStack_MediaPackageChannel",
      iamRoleSecret: "StreamingStack-MyMediaPackageRole2A6DBB2D-11N4MY00K42A0",
      secretsManagerSecret: "MediaPackage/StreamingStack",
    }),
  },
  {
    type: "OriginEndpoint",
    group: "MediaPackage",
    properties: ({}) => ({
      HlsPackage: {
        AdMarkers: "NONE",
        AdTriggers: [
          "BREAK",
          "DISTRIBUTOR_ADVERTISEMENT",
          "DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY",
          "DISTRIBUTOR_PLACEMENT_OPPORTUNITY",
          "PROVIDER_ADVERTISEMENT",
          "PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY",
          "PROVIDER_PLACEMENT_OPPORTUNITY",
          "SPLICE_INSERT",
        ],
        AdsOnDeliveryRestrictions: "RESTRICTED",
        IncludeDvbSubtitles: false,
        IncludeIframeOnlyStream: false,
        PlaylistType: "EVENT",
        PlaylistWindowSeconds: 60,
        ProgramDateTimeIntervalSeconds: 0,
        SegmentDurationSeconds: 5,
        StreamSelection: {
          MaxVideoBitsPerSecond: 2147483647,
          MinVideoBitsPerSecond: 0,
          StreamOrder: "ORIGINAL",
        },
        UseAudioRenditionGroup: true,
      },
      Id: "StreamingStack-hls-StreamingStack_MediaPackageChannel",
    }),
    dependencies: ({}) => ({
      channel: "StreamingStack_MediaPackageChannel",
      iamRoleSecret: "StreamingStack-MyMediaPackageRole2A6DBB2D-11N4MY00K42A0",
      secretsManagerSecret: "MediaPackage/StreamingStack",
    }),
  },
  {
    type: "OriginEndpoint",
    group: "MediaPackage",
    properties: ({}) => ({
      Id: "StreamingStack-mss-",
      MssPackage: {
        ManifestWindowSeconds: 60,
        SegmentDurationSeconds: 5,
        StreamSelection: {
          MaxVideoBitsPerSecond: 2147483647,
          MinVideoBitsPerSecond: 0,
          StreamOrder: "ORIGINAL",
        },
      },
    }),
    dependencies: ({}) => ({
      channel: "StreamingStack_MediaPackageChannel",
      iamRoleSecret: "StreamingStack-MyMediaPackageRole2A6DBB2D-11N4MY00K42A0",
      secretsManagerSecret: "MediaPackage/StreamingStack",
    }),
  },
  {
    type: "Secret",
    group: "SecretsManager",
    properties: ({}) => ({
      Name: "MediaPackage/StreamingStack",
      SecretString: {
        MediaPackageCDNIdentifier: "4pq4\\%o@'u@|,<SpNq@AsEY5e(x.wd+-",
      },
      Description: "Secret for Secure Resilient Live Streaming Delivery",
    }),
  },
];
