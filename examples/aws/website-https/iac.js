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

exports.makeDomainName = makeDomainName;

const createResources = async ({ provider }) => {
  const config = provider.config();
  const { DomainName, websiteDir, stage } = config;

  assert(DomainName);
  assert(websiteDir);
  assert(stage);

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

  const domainName = makeDomainName({
    DomainName,
    stage,
  });

  const certificate = await provider.makeCertificate({
    name: `certificate-${DomainName}-${stage}`,
    properties: () => ({
      DomainName: domainName,
    }),
  });

  const domain = await provider.useRoute53Domain({
    name: DomainName,
  });

  const hostedZone = await provider.makeHostedZone({
    name: `${domainName}.`,
    dependencies: { domain },
    properties: ({}) => ({}),
  });

  const recordValidation = await provider.makeRoute53Record({
    name: `validation-${domainName}.`,
    dependencies: { hostedZone, certificate },
    properties: ({ dependencies: { certificate } }) => {
      const domainValidationOption =
        certificate?.live?.DomainValidationOptions[0];
      const record = domainValidationOption?.ResourceRecord;
      if (domainValidationOption) {
        assert(
          record,
          `missing record in DomainValidationOptions, certificate ${JSON.stringify(
            certificate.live
          )}`
        );
      }
      return {
        Name: record?.Name,
        ResourceRecords: [
          {
            Value: record?.Value,
          },
        ],
        TTL: 300,
        Type: "CNAME",
      };
    },
  });

  const distribution = await provider.makeCloudFrontDistribution({
    name: `distribution-${bucketName}`,
    dependencies: { websiteBucket, certificate },
    properties: ({}) => {
      return {
        DistributionConfigWithTags: {
          DistributionConfig: {
            Comment: `${bucketName}.s3.amazonaws.com`,
            Aliases: { Quantity: 1, Items: [domainName] },
            DefaultRootObject: "index.html",
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

  const hostedZoneName = `${makeDomainName({
    DomainName,
    stage,
  })}.`;

  const recordCloudFront = await provider.makeRoute53Record({
    name: hostedZoneName,
    dependencies: { hostedZone, distribution },
    properties: ({ dependencies: { distribution } }) => {
      return {
        Name: hostedZoneName,
        Type: "A",
        AliasTarget: {
          HostedZoneId: "Z2FDTNDATAQYW2",
          DNSName: distribution?.live?.DomainName,
          EvaluateTargetHealth: false,
        },
      };
    },
  });

  return {
    certificate,
    websiteBucket,
    recordCloudFront,
    distribution,
    hostedZone,
  };
};

exports.createResources = createResources;

exports.createStack = async ({ name = "aws", config }) => {
  const provider = AwsProvider({
    name: "aws-us-east",
    config: { ...config, region: "us-east-1" },
  });

  const resources = await createResources({
    provider,
    config,
  });

  provider.register({ resources });

  return {
    provider,
    resources,
  };
};
