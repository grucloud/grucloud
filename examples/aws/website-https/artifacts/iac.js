// Generated by aws2gc
const { get } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.S3.makeBucket({
    name: get("config.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev.name"),
    properties: get(
      "config.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev.properties"
    ),
  });

  provider.S3.makeObject({
    name: get("config.S3.Object.buildBundleCss.name"),
    properties: get("config.S3.Object.buildBundleCss.properties"),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
  });

  provider.S3.makeObject({
    name: get("config.S3.Object.buildBundleJs.name"),
    properties: get("config.S3.Object.buildBundleJs.properties"),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
  });

  provider.S3.makeObject({
    name: get("config.S3.Object.faviconPng.name"),
    properties: get("config.S3.Object.faviconPng.properties"),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
  });

  provider.S3.makeObject({
    name: get("config.S3.Object.globalCss.name"),
    properties: get("config.S3.Object.globalCss.properties"),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
  });

  provider.S3.makeObject({
    name: get("config.S3.Object.indexHtml.name"),
    properties: get("config.S3.Object.indexHtml.properties"),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
    }),
  });

  provider.CloudFront.makeDistribution({
    name: get(
      "config.CloudFront.Distribution.distributionCloudfrontAwsTestGrucloudOrgDev.name"
    ),
    properties: get(
      "config.CloudFront.Distribution.distributionCloudfrontAwsTestGrucloudOrgDev.properties"
    ),
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket.cloudfrontAwsTestGrucloudOrgDev,
      certificate: resources.ACM.Certificate.devCloudfrontAwsTestGrucloudOrg,
    }),
  });

  provider.ACM.makeCertificate({
    name: get("config.ACM.Certificate.devCloudfrontAwsTestGrucloudOrg.name"),
    properties: get(
      "config.ACM.Certificate.devCloudfrontAwsTestGrucloudOrg.properties"
    ),
  });

  provider.Route53Domains.useDomain({
    name: get("config.Route53Domains.Domain.grucloudOrg.name"),
  });

  provider.Route53.makeHostedZone({
    name: get("config.Route53.HostedZone.devCloudfrontAwsTestGrucloudOrg.name"),
    dependencies: ({ resources }) => ({
      domain: resources.Route53Domains.Domain.grucloudOrg,
    }),
  });

  provider.Route53.makeRecord({
    name: get(
      "config.Route53.Record.distributionAliasDevCloudfrontAwsTestGrucloudOrg.name"
    ),
    dependencies: ({ resources }) => ({
      hostedZone: resources.Route53.HostedZone.devCloudfrontAwsTestGrucloudOrg,
      distribution:
        resources.CloudFront.Distribution
          .distributionCloudfrontAwsTestGrucloudOrgDev,
    }),
  });

  provider.Route53.makeRecord({
    name: get(
      "config.Route53.Record.validationDevCloudfrontAwsTestGrucloudOrg.name"
    ),
    dependencies: ({ resources }) => ({
      hostedZone: resources.Route53.HostedZone.devCloudfrontAwsTestGrucloudOrg,
      certificate: resources.ACM.Certificate.devCloudfrontAwsTestGrucloudOrg,
    }),
  });
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  createResources({
    provider,
  });

  return {
    provider,
  };
};
