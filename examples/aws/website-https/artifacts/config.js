module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-website-https",
  s3: {
    Bucket: {
      cloudfrontAwsTestGrucloudOrgDev: {
        name: "cloudfront.aws.test.grucloud.org-dev",
        properties: {
          ACL: "public-read",
          WebsiteConfiguration: {
            IndexDocument: {
              Suffix: "index.html",
            },
            ErrorDocument: {
              Key: "error.html",
            },
          },
        },
      },
    },
    Object: {
      buildBundleCss: {
        name: "build/bundle.css",
        properties: {
          ContentType: "text/css",
          source:
            "s3/cloudfront.aws.test.grucloud.org-dev/build/bundle.css.css",
        },
      },
      buildBundleJs: {
        name: "build/bundle.js",
        properties: {
          ContentType: "application/javascript",
          source: "s3/cloudfront.aws.test.grucloud.org-dev/build/bundle.js.js",
        },
      },
      faviconPng: {
        name: "favicon.png",
        properties: {
          ContentType: "image/png",
          source: "s3/cloudfront.aws.test.grucloud.org-dev/favicon.png.png",
        },
      },
      globalCss: {
        name: "global.css",
        properties: {
          ContentType: "text/css",
          source: "s3/cloudfront.aws.test.grucloud.org-dev/global.css.css",
        },
      },
      indexHtml: {
        name: "index.html",
        properties: {
          ContentType: "text/html",
          source: "s3/cloudfront.aws.test.grucloud.org-dev/index.html.html",
        },
      },
    },
  },
  cloudFront: {
    Distribution: {
      distributionCloudfrontAwsTestGrucloudOrgDev: {
        name: "distribution-cloudfront.aws.test.grucloud.org-dev",
        properties: {
          PriceClass: "PriceClass_100",
          Aliases: {
            Quantity: 1,
            Items: ["dev.cloudfront.aws.test.grucloud.org"],
          },
          DefaultRootObject: "index.html",
          DefaultCacheBehavior: {
            TargetOriginId: "S3-cloudfront.aws.test.grucloud.org-dev",
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
                Items: [],
              },
              QueryStringCacheKeys: {
                Quantity: 0,
                Items: [],
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
                Id: "S3-cloudfront.aws.test.grucloud.org-dev",
                DomainName:
                  "cloudfront.aws.test.grucloud.org-dev.s3.amazonaws.com",
                OriginPath: "",
                CustomHeaders: {
                  Quantity: 0,
                  Items: [],
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
          Comment: "cloudfront.aws.test.grucloud.org-dev.s3.amazonaws.com",
          Logging: {
            Enabled: false,
            IncludeCookies: false,
            Bucket: "",
            Prefix: "",
          },
        },
      },
    },
  },
  acm: {
    Certificate: {
      devCloudfrontAwsTestGrucloudOrg: {
        name: "dev.cloudfront.aws.test.grucloud.org",
        properties: {
          DomainName: "dev.cloudfront.aws.test.grucloud.org",
          Tags: [
            {
              Key: "ManagedBy",
              Value: "GruCloud",
            },
            {
              Key: "stage",
              Value: "dev",
            },
            {
              Key: "projectName",
              Value: "@grucloud/example-aws-website-https",
            },
            {
              Key: "CreatedByProvider",
              Value: "aws",
            },
          ],
        },
      },
      grucloudOrg: {
        name: "grucloud.org",
        properties: {
          DomainName: "grucloud.org",
        },
      },
    },
  },
  route53Domain: {
    Domain: {
      grucloudOrg: {
        name: "grucloud.org",
      },
    },
  },
  route53: {
    HostedZone: {
      devCloudfrontAwsTestGrucloudOrg: {
        name: "dev.cloudfront.aws.test.grucloud.org.",
      },
    },
    Record: {
      distributionAliasDevCloudfrontAwsTestGrucloudOrg: {
        name: "distribution-alias-dev.cloudfront.aws.test.grucloud.org",
      },
      validationDevCloudfrontAwsTestGrucloudOrg: {
        name: "validation-dev.cloudfront.aws.test.grucloud.org.",
      },
    },
  },
});
