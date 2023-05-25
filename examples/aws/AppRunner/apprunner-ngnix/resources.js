// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "CustomDomain",
    group: "AppRunner",
    properties: ({}) => ({
      DomainName: "runner.grucloud.org",
    }),
    dependencies: ({}) => ({
      service: "nginx-01GPFJZH2B9WNG546PXJWBYGDS",
    }),
  },
  {
    type: "Service",
    group: "AppRunner",
    properties: ({ config }) => ({
      ServiceName: "nginx-01GPFJZH2B9WNG546PXJWBYGDS",
      NetworkConfiguration: {
        IngressConfiguration: {
          IsPubliclyAccessible: true,
        },
      },
      SourceConfiguration: {
        AutoDeploymentsEnabled: false,
        ImageRepository: {
          ImageConfiguration: {
            Port: "80",
          },
          ImageIdentifier: "public.ecr.aws/nginx/nginx:1-alpine-perl",
          ImageRepositoryType: "ECR_PUBLIC",
        },
      },
      InstanceConfiguration: {
        Cpu: "1024",
        Memory: "2048",
      },
      ObservabilityConfiguration: {
        ObservabilityConfigurationArn: `arn:aws:apprunner:${
          config.region
        }:${config.accountId()}:observabilityconfiguration/DefaultConfiguration/1/00000000000000000000000000000001`,
        ObservabilityEnabled: true,
      },
      HealthCheckConfiguration: {
        HealthyThreshold: 1,
        Interval: 10,
        Path: "/",
        Protocol: "TCP",
        Timeout: 5,
        UnhealthyThreshold: 5,
      },
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "grucloud.org.",
    }),
    dependencies: ({}) => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: ({}) => ({
      hostedZone: "grucloud.org.",
      appRunnerCustomDomain: "runner.grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: ({}) => ({
      hostedZone: "grucloud.org.",
      appRunnerCustomDomain2: "runner.grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    properties: ({ getId }) => ({
      Name: "runner.grucloud.org.",
      Type: "CNAME",
      TTL: 300,
      ResourceRecords: [
        {
          Value: `${getId({
            type: "Service",
            group: "AppRunner",
            name: "nginx-01GPFJZH2B9WNG546PXJWBYGDS",
            path: "live.ServiceUrl",
          })}`,
        },
      ],
    }),
    dependencies: ({}) => ({
      hostedZone: "grucloud.org.",
      appRunnerService: "nginx-01GPFJZH2B9WNG546PXJWBYGDS",
    }),
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: "grucloud.org",
    readOnly: true,
  },
];