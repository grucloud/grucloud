// Generated by aws2gc
const { get } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = ({ provider }) => {
  provider.IAM.makePolicy({
    name: get("config.IAM.Policy.lambdaPolicy.name"),
    properties: get("config.IAM.Policy.lambdaPolicy.properties"),
  });

  provider.IAM.makeRole({
    name: get("config.IAM.Role.lambdaRole.name"),
    properties: get("config.IAM.Role.lambdaRole.properties"),
    dependencies: ({ resources }) => ({
      policies: [resources.IAM.Policy.lambdaPolicy],
    }),
  });

  provider.ACM.makeCertificate({
    name: get("config.ACM.Certificate.grucloudOrg.name"),
    properties: get("config.ACM.Certificate.grucloudOrg.properties"),
  });

  provider.Route53Domains.useDomain({
    name: get("config.Route53Domains.Domain.grucloudOrg.name"),
  });

  provider.Route53.makeHostedZone({
    name: get("config.Route53.HostedZone.grucloudOrg.name"),
    dependencies: ({ resources }) => ({
      domain: resources.Route53Domains.Domain.grucloudOrg,
    }),
  });

  provider.Route53.makeRecord({
    name: get("config.Route53.Record.apiGatewayAliasRecord.name"),
    properties: get("config.Route53.Record.apiGatewayAliasRecord.properties"),
    dependencies: ({ resources }) => ({
      hostedZone: resources.Route53.HostedZone.grucloudOrg,
    }),
  });

  provider.Route53.makeRecord({
    name: get("config.Route53.Record.certificateValidationGrucloudOrg.name"),
    dependencies: ({ resources }) => ({
      hostedZone: resources.Route53.HostedZone.grucloudOrg,
      certificate: resources.ACM.Certificate.grucloudOrg,
    }),
  });

  provider.Lambda.makeFunction({
    name: get("config.Lambda.Function.myFunction.name"),
    properties: get("config.Lambda.Function.myFunction.properties"),
    dependencies: ({ resources }) => ({
      role: resources.IAM.Role.lambdaRole,
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
