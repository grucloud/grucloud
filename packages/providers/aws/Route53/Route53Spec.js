const assert = require("assert");
const {
  tap,
  pipe,
  assign,
  map,
  pick,
  get,
  eq,
  or,
  switchCase,
  filter,
} = require("rubico");
const { prepend, isEmpty, find, includes } = require("rubico/x");
const { omitIfEmpty, buildGetId } = require("@grucloud/core/Common");
const { hasDependency } = require("@grucloud/core/generatorUtils");

const {
  isOurMinion,
  compareAws,
  replaceAccountAndRegion,
} = require("../AwsCommon");
const { Route53HostedZone } = require("./Route53HostedZone");
const { Route53ZoneVpcAssociation } = require("./Route53ZoneVpcAssociation");
const { Route53Record, compareRoute53Record } = require("./Route53Record");
const {
  Route53VpcAssociationAuthorization,
} = require("./Route53VpcAssociationAuthorization");
const { Route53HealthCheck } = require("./Route53HealthCheck");
const defaultsDeep = require("rubico/x/defaultsDeep");

const GROUP = "Route53";

const compareRoute53 = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "HealthCheck",
      dependencies: {
        cloudWatchAlarm: {
          type: "Alarm",
          group: "CloudWatch",
        },
        routingControl: {
          type: "RoutingControl",
          group: "Route53RecoveryControlConfig",
        },
      },
      Client: Route53HealthCheck,
      compare: compareRoute53({
        filterTarget: () => pipe([() => ({})]),
        filterLive: () => pipe([() => ({})]),
      }),
      inferName: ({ properties, dependenciesSpec: { routingControl } }) =>
        pipe([
          () => properties,
          get("HealthCheckConfig"),
          switchCase([
            ({ Type }) =>
              pipe([
                () => [
                  "HTTP",
                  "HTTPS",
                  "HTTP_STR_MATCH",
                  "HTTPS_STR_MATCH",
                  "TCP",
                ],
                includes(Type),
              ])(),
            ({ Type, FullyQualifiedDomainName, IPAddress }) =>
              `heathcheck::${Type}::${FullyQualifiedDomainName || IPAddress}`,
            //TODO
            eq(get("Type"), "CALCULATED"),
            pipe([get("ResourcePath"), prepend("heathcheck::CALCULATED::")]),
            eq(get("Type"), "CLOUDWATCH_METRIC"),
            pipe([
              get("AlarmIdentifier.Name"),
              prepend("heathcheck::CLOUDWATCH_METRIC::"),
            ]),
            eq(get("Type"), "RECOVERY_CONTROL"),
            () => `heathcheck::RECOVERY_CONTROL::${routingControl}`,
          ]),
        ])(),
      propertiesDefault: {
        HealthCheckConfig: {
          RequestInterval: 30,
          FailureThreshold: 3,
          MeasureLatency: false,
          Inverted: false,
          Disabled: false,
          EnableSNI: false,
        },
      },
      omitProperties: [
        "Id",
        "CallerReference",
        "LinkedService",
        "HealthCheckConfig.RoutingControlArn",
      ],
      filterLive: ({ providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
    },
    {
      type: "HostedZone",
      dependencies: {
        domain: { type: "Domain", group: "Route53Domains" },
        hostedZone: {
          type: "HostedZone",
          group: "Route53",
          ignoreOnDestroy: true,
        },
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
        },
      },
      Client: Route53HostedZone,
      compare: compareRoute53({
        filterTarget: () => pipe([() => ({})]),
        filterLive: () => pipe([() => ({})]),
      }),
      filterLive: ({ providerConfig }) =>
        pipe([
          pick(["Config.Comment"]),
          omitIfEmpty(["Config.Comment"]),
          omitIfEmpty(["Config"]),
        ]),
      includeDefaultDependencies: true,
    },
    {
      type: "ZoneVpcAssociation",
      Client: Route53ZoneVpcAssociation,
      dependencies: {
        hostedZone: {
          type: "HostedZone",
          group: "Route53",
          parent: true,
        },
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
        },
      },
      omitProperties: ["HostedZoneId", "Name", "Owner", "VPC"],
      inferName: ({ properties, dependenciesSpec: { hostedZone, vpc } }) =>
        pipe([() => `zone-assoc::${hostedZone}::${vpc}`])(),
      compare: compareRoute53({
        filterTarget: () => pipe([() => ({})]),
        filterLive: () => pipe([() => ({})]),
      }),
      // TODO region
      //filterLive: () => pick([]),
    },
    {
      type: "VpcAssociationAuthorization",
      Client: Route53VpcAssociationAuthorization,
      dependencies: {
        hostedZone: {
          type: "HostedZone",
          group: "Route53",
          parent: true,
        },
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
        },
      },
      omitProperties: ["HostedZoneId", "VPC"],
      inferName: ({ properties, dependenciesSpec: { hostedZone, vpc } }) =>
        pipe([() => `vpc-assoc-auth::${hostedZone}::${vpc}`])(),
      compare: compareRoute53({
        filterTarget: () => pipe([() => ({})]),
        filterLive: () => pipe([() => ({})]),
      }),
      // TODO region
      //filterLive: () => pick([]),
    },
    {
      type: "Record",
      dependencies: {
        hostedZone: { type: "HostedZone", group: "Route53", parent: true },
        elasticIpAddress: { type: "ElasticIpAddress", group: "EC2" },
        loadBalancer: { type: "LoadBalancer", group: "ELBv2" },
        certificate: { type: "Certificate", group: "ACM" },
        distribution: { type: "Distribution", group: "CloudFront" },
        userPoolDomain: {
          type: "UserPoolDomain",
          group: "CognitoIdentityServiceProvider",
        },
        apiGatewayV2DomainName: { type: "DomainName", group: "ApiGatewayV2" },
        vpcEndpoint: { type: "VpcEndpoint", group: "EC2" },
        healthCheck: { type: "healthCheck", group: "Route53" },
      },
      Client: Route53Record,
      isOurMinion: () => true,
      compare: compareRoute53Record,
      omitProperties: ["AliasTarget.HostedZoneId", "AliasTarget.DNSName"],
      inferName: ({ properties, dependenciesSpec }) =>
        pipe([
          () => dependenciesSpec,
          tap(() => {
            assert(dependenciesSpec);
          }),
          switchCase([
            get("vpcEndpoint"),
            pipe([
              () => `EC2::VpcEndpoint::${properties.Type}::${properties.Name}`,
            ]),
            get("elasticIpAddress"),
            pipe([
              get("elasticIpAddress", "noName"),
              prepend("EC2::ElasticIpAddress::A::"),
            ]),
            get("certificate"),
            pipe([get("certificate"), prepend(`ACM::Certificate::CNAME::`)]),
            get("userPoolDomain"),
            pipe([
              get("userPoolDomain"),
              prepend("CognitoIdentityServiceProvider::UserPoolDomain::A::"),
            ]),
            get("loadBalancer"),
            pipe([get("loadBalancer"), prepend("ELBv2::LoadBalancer::A::")]),
            get("distribution"),
            pipe([
              get("distribution"),
              prepend("CloudFront::Distribution::A::"),
            ]),
            get("apiGatewayV2DomainName"),
            pipe([
              get("apiGatewayV2DomainName"),
              prepend("ApiGatewayV2::DomainName::A::"),
            ]),
            () => `${properties.Type}::${properties.Name}`,
          ]),
          prepend(`record::`),
          tap((params) => {
            assert(true);
          }),
        ])(),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          pick(["Name", "Type", "TTL", "ResourceRecords", "AliasTarget"]),
          assign({
            Name: pipe([
              get("Name"),
              replaceAccountAndRegion({ lives, providerConfig }),
            ]),
            ResourceRecords: pipe([
              get("ResourceRecords"),
              map((resourceRecord) =>
                pipe([
                  () => lives,
                  filter(eq(get("groupType"), "EC2::ElasticIpAddress")),
                  find(eq(get("live.PublicIp"), resourceRecord.Value)),
                  switchCase([
                    isEmpty,
                    () => resourceRecord,
                    (IPAddress) =>
                      pipe([
                        () => resourceRecord,
                        assign({
                          Value: pipe([
                            () => IPAddress,
                            buildGetId({
                              id: IPAddress.id,
                              path: "live.PublicIp",
                              providerConfig,
                            }),
                            (result) => () => result,
                          ]),
                        }),
                      ])(),
                  ]),
                ])()
              ),
            ]),
          }),
          omitIfEmpty(["ResourceRecords"]),
        ]),
      hasNoProperty: ({ lives, resource }) =>
        pipe([
          () => resource,
          or([
            hasDependency({ type: "LoadBalancer", group: "ELBv2" }),
            hasDependency({ type: "Certificate", group: "ACM" }),
            hasDependency({ type: "Distribution", group: "CloudFront" }),
            hasDependency({ type: "DomainName", group: "ApiGatewayV2" }),
            hasDependency({
              type: "UserPoolDomain",
              group: "CognitoIdentityServiceProvider",
            }),
          ]),
        ])(),
      //TODO remove ?
      ignoreResource: () => get("cannotBeDeleted"),
    },
  ],
  map(defaultsDeep({ group: GROUP, isOurMinion })),
]);
