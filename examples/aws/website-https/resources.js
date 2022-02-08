const assert = require("assert");
const path = require("path");
const { map } = require("rubico");
const mime = require("mime-types");

const { makeDomainName, getFiles } = require("./dumpster");

const createResources = async ({ provider }) => {
  const { config } = provider;
  const { rootDomainName, DomainName, websiteDir, stage } = config;
  assert(rootDomainName);
  assert(DomainName);
  assert(websiteDir);
  assert(stage);

  const bucketName = `${DomainName}-${stage}`;
  const domainName = makeDomainName({
    DomainName,
    stage,
  });
  const hostedZoneName = `${domainName}.`;
  const distributionName = `distribution-${bucketName}`;
  const files = await getFiles(websiteDir);

  provider.S3.makeBucket({
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
    provider.S3.makeObject({
      name: file,
      dependencies: () => ({ bucket: bucketName }),
      properties: () => ({
        ACL: "public-read",
        ContentType: mime.lookup(file) || "text/plain",
        source: path.join(websiteDir, file),
      }),
    })
  )(files);

  provider.ACM.makeCertificate({
    name: domainName,
  });

  provider.Route53Domains.useDomain({
    name: rootDomainName,
  });

  provider.Route53.makeHostedZone({
    name: hostedZoneName,
    dependencies: () => ({ domain: rootDomainName }),
  });

  provider.Route53.makeRecord({
    dependencies: () => ({
      hostedZone: hostedZoneName,
      certificate: domainName,
    }),
  });

  provider.Route53.makeRecord({
    dependencies: () => ({
      hostedZone: hostedZoneName,
      distribution: distributionName,
    }),
  });

  provider.CloudFront.makeDistribution({
    name: distributionName,
    dependencies: () => ({
      bucket: bucketName,
      certificate: domainName,
    }),
    properties: ({}) => {
      return {
        PriceClass: "PriceClass_100",
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
      };
    },
  });
};

exports.createResources = createResources;
