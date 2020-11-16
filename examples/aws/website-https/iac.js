const { AwsProvider } = require("@grucloud/core");
const { pipe, map } = require("rubico");

const createResources = async ({ provider, config }) => {
  const { domainName } = config;

  const websiteBucket = await provider.makeS3Bucket({
    name: `${domainName}-bucket`,
    properties: () => ({
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
  });

  const certificate = await provider.makeCertificate({
    name: `certificate-${domainName}`,
    properties: () => ({ DomainName: domainName }),
  });

  const hostedZone = await provider.makeHostedZone({
    name: `${domainName}`,
    dependencies: { certificate },
    properties: ({ dependencies: { certificate } }) => {
      const record =
        certificate.live?.DomainValidationOptions[0].ResourceRecord;
      return {
        RecordSet: [
          {
            Name: record?.Name,
            ResourceRecords: [
              {
                Value: record?.Value,
              },
            ],
            Type: "CNAME",
          },
        ],
      };
    },
  });
  /*
  const distribution = await provider.makeCloudFrontDistribution({
    name: `distribution-${domainName}`,
    dependencies: { websiteBucket },
    properties: ({ dependencies }) => {
      return {
        DistributionConfigWithTags: {
          DistributionConfig: {
            Comment: `${domainName}.s3.amazonaws.com`,
            DefaultCacheBehavior: {
              TargetOriginId: `S3-${domainName}`,
              ViewerProtocolPolicy: "redirect-to-https",
              ForwardedValues: {
                Cookies: {
                  Forward: "none",
                },
                QueryString: false,
              },
              MinTTL: 600,
              TrustedSigners: {
                Enabled: false,
                Quantity: 0,
                Items: [],
              },
            },
            Origins: {
              Items: [
                {
                  DomainName: `${domainName}.s3.amazonaws.com`,
                  Id: `S3-${domainName}`,
                  S3OriginConfig: { OriginAccessIdentity: "" },
                },
              ],
              Quantity: 1,
            },
          },
        },
      };
    },
  });
  */
  return { websiteBucket, hostedZone, certificate /*, distribution*/ };
};

exports.createResources = createResources;

exports.createStack = async ({ name = "aws", config }) => {
  const provider = AwsProvider({ name, config });
  const resources = await createResources({ provider, config });
  return { provider, resources };
};
