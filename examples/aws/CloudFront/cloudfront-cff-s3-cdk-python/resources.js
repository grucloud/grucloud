// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Distribution",
    group: "CloudFront",
    properties: ({ getId }) => ({
      PriceClass: "PriceClass_All",
      DefaultRootObject: "",
      DefaultCacheBehavior: {
        TargetOriginId:
          "CloudfrontCffS3CdkPythonStackMyDistributionOrigin128091E74",
        TrustedSigners: {
          Enabled: false,
        },
        TrustedKeyGroups: {
          Enabled: false,
        },
        ViewerProtocolPolicy: "allow-all",
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
        FunctionAssociations: {
          Quantity: 1,
          Items: [
            {
              FunctionARN: `${getId({
                type: "Function",
                group: "CloudFront",
                name: "us-east-1CloudfronS3CdkPythonStackFunction980062BC::DEVELOPMENT",
              })}`,
              EventType: "viewer-request",
            },
          ],
        },
        FieldLevelEncryptionId: "",
        CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6",
      },
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: "CloudfrontCffS3CdkPythonStackMyDistributionOrigin128091E74",
            DomainName: `${getId({
              type: "Bucket",
              group: "S3",
              name: "cloudfrontcffs3cdkpythons-myhostingbucket134f0bf0-6xvzrcdh4qv5",
              path: "name",
            })}.s3.us-east-1.amazonaws.com`,
            OriginPath: "",
            CustomHeaders: {
              Quantity: 0,
            },
            S3OriginConfig: {
              OriginAccessIdentity: `origin-access-identity/cloudfront/${getId({
                type: "OriginAccessIdentity",
                group: "CloudFront",
                name: "Identity for CloudfrontCffS3CdkPythonStackMyDistributionOrigin128091E74",
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
        CloudFrontDefaultCertificate: true,
        SSLSupportMethod: "vip",
        MinimumProtocolVersion: "TLSv1",
        CertificateSource: "cloudfront",
      },
    }),
    dependencies: () => ({
      buckets: [
        "cloudfrontcffs3cdkpythons-myhostingbucket134f0bf0-6xvzrcdh4qv5",
      ],
      functions: [
        "us-east-1CloudfronS3CdkPythonStackFunction980062BC::DEVELOPMENT",
      ],
      originAccessIdentities: [
        "Identity for CloudfrontCffS3CdkPythonStackMyDistributionOrigin128091E74",
      ],
    }),
  },
  {
    type: "Function",
    group: "CloudFront",
    properties: ({}) => ({
      ContentType: "application/octet-stream",
      FunctionCode:
        "//A version of the homepage\nvar X_Experiment_A = 'index.html';\n//B version of the homepage\nvar X_Experiment_B = 'index_b.html';\n\nfunction handler(event) {\n    var request = event.request;\n    if (Math.random() < 0.8) {\n        request.uri = '/' + X_Experiment_A;\n    } else {\n        request.uri = '/' + X_Experiment_B;\n    }\n    //log which version is displayed\n    console.log('X_Experiment_V ' + (request.uri == '/index.html' ? 'A_VERSION' : 'B_VERSION'));\n    return request;\n}",
      Name: "us-east-1CloudfronS3CdkPythonStackFunction980062BC",
      FunctionConfig: {
        Runtime: "cloudfront-js-1.0",
      },
      FunctionMetadata: {
        Stage: "DEVELOPMENT",
      },
    }),
  },
  {
    type: "Function",
    group: "CloudFront",
    properties: ({}) => ({
      ContentType: "application/octet-stream",
      FunctionCode:
        "//A version of the homepage\nvar X_Experiment_A = 'index.html';\n//B version of the homepage\nvar X_Experiment_B = 'index_b.html';\n\nfunction handler(event) {\n    var request = event.request;\n    if (Math.random() < 0.8) {\n        request.uri = '/' + X_Experiment_A;\n    } else {\n        request.uri = '/' + X_Experiment_B;\n    }\n    //log which version is displayed\n    console.log('X_Experiment_V ' + (request.uri == '/index.html' ? 'A_VERSION' : 'B_VERSION'));\n    return request;\n}",
      Name: "us-east-1CloudfronS3CdkPythonStackFunction980062BC",
      FunctionConfig: {
        Runtime: "cloudfront-js-1.0",
      },
      FunctionMetadata: {
        Stage: "LIVE",
      },
    }),
  },
  {
    type: "OriginAccessIdentity",
    group: "CloudFront",
    name: "Identity for CloudfrontCffS3CdkPythonStackMyDistributionOrigin128091E74",
  },
  {
    type: "Role",
    group: "IAM",
    name: "CloudfrontCffS3CdkPythonS-CustomCDKBucketDeploymen-1VYB8Q83IK84K",
    properties: ({}) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: `lambda.amazonaws.com`,
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
                Action: ["s3:GetObject*", "s3:GetBucket*", "s3:List*"],
                Resource: [
                  "arn:aws:s3:::cdk-hnb659fds-assets-840541460064-us-east-1",
                  "arn:aws:s3:::cdk-hnb659fds-assets-840541460064-us-east-1/*",
                ],
                Effect: "Allow",
              },
              {
                Action: [
                  "s3:GetObject*",
                  "s3:GetBucket*",
                  "s3:List*",
                  "s3:DeleteObject*",
                  "s3:PutObject",
                  "s3:Abort*",
                ],
                Resource: [
                  "arn:aws:s3:::cloudfrontcffs3cdkpythons-myhostingbucket134f0bf0-6xvzrcdh4qv5",
                  "arn:aws:s3:::cloudfrontcffs3cdkpythons-myhostingbucket134f0bf0-6xvzrcdh4qv5/*",
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName:
            "CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF",
        },
      ],
      AttachedPolicies: [
        {
          PolicyName: "AWSLambdaBasicExecutionRole",
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Layer",
    group: "Lambda",
    properties: ({}) => ({
      LayerName: "myDeploymentAwsCliLayerEF6B12EC",
      Description: "/opt/awscli/aws",
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName:
          "CloudfrontCffS3CdkPythonS-CustomCDKBucketDeploymen-fRgMn9FyLO2d",
        Handler: "index.handler",
        Runtime: "python3.7",
        Timeout: 900,
      },
    }),
    dependencies: () => ({
      layers: ["myDeploymentAwsCliLayerEF6B12EC"],
      role: "CloudfrontCffS3CdkPythonS-CustomCDKBucketDeploymen-1VYB8Q83IK84K",
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ getId }) => ({
      Name: "cloudfrontcffs3cdkpythons-myhostingbucket134f0bf0-6xvzrcdh4qv5",
      Policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${getId(
                {
                  type: "OriginAccessIdentity",
                  group: "CloudFront",
                  name: "Identity for CloudfrontCffS3CdkPythonStackMyDistributionOrigin128091E74",
                }
              )}`,
            },
            Action: "s3:GetObject",
            Resource:
              "arn:aws:s3:::cloudfrontcffs3cdkpythons-myhostingbucket134f0bf0-6xvzrcdh4qv5/*",
          },
        ],
      },
    }),
    dependencies: () => ({
      originAccessIdentities: [
        "Identity for CloudfrontCffS3CdkPythonStackMyDistributionOrigin128091E74",
      ],
    }),
  },
  {
    type: "Object",
    group: "S3",
    name: "index_b.html",
    properties: ({}) => ({
      ContentType: "text/html",
      source:
        "s3/cloudfrontcffs3cdkpythons-myhostingbucket134f0bf0-6xvzrcdh4qv5/index_b.html",
    }),
    dependencies: () => ({
      bucket: "cloudfrontcffs3cdkpythons-myhostingbucket134f0bf0-6xvzrcdh4qv5",
    }),
  },
  {
    type: "Object",
    group: "S3",
    name: "index.html",
    properties: ({}) => ({
      ContentType: "text/html",
      source:
        "s3/cloudfrontcffs3cdkpythons-myhostingbucket134f0bf0-6xvzrcdh4qv5/index.html",
    }),
    dependencies: () => ({
      bucket: "cloudfrontcffs3cdkpythons-myhostingbucket134f0bf0-6xvzrcdh4qv5",
    }),
  },
];
