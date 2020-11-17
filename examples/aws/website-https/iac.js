const { AwsProvider } = require("@grucloud/core");
const { pipe, map } = require("rubico");

const createResources = async ({ provider, resources: { certificate } }) => {
  const config = provider.config();
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

  const hostedZone = await provider.makeHostedZone({
    name: `${domainName}.`,
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
            TTL: 300,
            Type: "CNAME",
          },
        ],
      };
    },
  });

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

  return { websiteBucket, hostedZone, distribution };
};

exports.createResources = createResources;

exports.createStack = async ({ name = "aws", config }) => {
  const providerUsEast = AwsProvider({
    name: "aws-us-east",
    config: { ...config, region: "us-east-1" },
  });
  const provider = AwsProvider({ name, config });

  const DomainName = provider.config().domainName;

  const certificate = await providerUsEast.makeCertificate({
    name: `certificate-${DomainName}`,
    properties: () => ({ DomainName }),
  });

  const resources = await createResources({
    provider,
    resources: { certificate },
    config,
  });
  return {
    sequencial: true,
    providers: [providerUsEast, provider],
    resources: { ...resources, certificate },
  };
};
