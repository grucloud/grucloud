const assert = require("assert");
const path = require("path");
const { map } = require("rubico");
const { resolve } = require("path");
const { readdir } = require("fs").promises;
const mime = require("mime-types");

const { AwsProvider } = require("@grucloud/core");

async function getFiles(dir) {
  const dirResolved = resolve(dir);
  const files = await getFilesWalk(dir);
  return files.map((file) => file.replace(`${dirResolved}/`, ""));
}

async function getFilesWalk(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFilesWalk(res) : res;
    })
  );
  return files.flat();
}
const makeDomainName = ({ DomainName, stage }) =>
  `${stage == "production" ? "" : `${stage}.`}${DomainName}`;

const createResources = async ({ provider, resources: { certificate } }) => {
  const config = provider.config();
  const { DomainName, websiteDir, stage } = config;
  assert(DomainName);
  assert(websiteDir);

  const files = await getFiles(websiteDir);
  const bucketName = `${DomainName}-${stage}`;
  const websiteBucket = await provider.makeS3Bucket({
    name: bucketName,
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

  await map((file) =>
    provider.makeS3Object({
      name: file,
      dependencies: { bucket: websiteBucket },
      properties: () => ({
        ACL: "public-read",
        ContentType: mime.lookup(file) || "text/plain",
        source: path.join(websiteDir, file),
      }),
    })
  )(files);

  const hostedZone = await provider.makeHostedZone({
    name: `${makeDomainName({
      DomainName,
      stage,
    })}.`,
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
    name: `distribution-${bucketName}`,
    dependencies: { websiteBucket },
    properties: ({}) => {
      return {
        DistributionConfigWithTags: {
          DistributionConfig: {
            Comment: `${bucketName}.s3.amazonaws.com`,
            DefaultCacheBehavior: {
              TargetOriginId: `S3-${bucketName}`,
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
                  DomainName: `${bucketName}.s3.amazonaws.com`,
                  Id: `S3-${bucketName}`,
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

  const { DomainName, stage } = provider.config();

  const certificate = await providerUsEast.makeCertificate({
    name: `certificate-${DomainName}-${stage}`,
    properties: () => ({
      DomainName: makeDomainName({ DomainName, stage }),
    }),
  });

  const resources = {
    ...(await createResources({
      provider,
      resources: { certificate },
      config,
    })),
    certificate,
  };

  provider.register({ resources });

  return {
    sequencial: true,
    providers: [providerUsEast, provider],
    resources,
  };
};
