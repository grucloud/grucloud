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
  omit,
  not,
} = require("rubico");
const {
  isObject,
  append,
  prepend,
  isEmpty,
  find,
  includes,
  when,
  unless,
  callProp,
  defaultsDeep,
  first,
  pluck,
} = require("rubico/x");

const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");
const { hasDependency } = require("@grucloud/core/generatorUtils");
const { createAwsService } = require("../AwsService");

const {
  isOurMinion,
  compareAws,
  replaceAccountAndRegion,
  replaceRegion,
} = require("../AwsCommon");
const {
  Route53HostedZone,
  findDnsServers,
  findNsRecordByName,
} = require("./Route53HostedZone");
const { Route53ZoneVpcAssociation } = require("./Route53ZoneVpcAssociation");
const {
  Route53Record,
  compareRoute53Record,
  Route53RecordDependencies,
} = require("./Route53Record");
const {
  Route53VpcAssociationAuthorization,
} = require("./Route53VpcAssociationAuthorization");
const { Route53HealthCheck } = require("./Route53HealthCheck");
const { Route53TrafficPolicy } = require("./Route53TrafficPolicy");
const {
  Route53TrafficPolicyInstance,
} = require("./Route53TrafficPolicyInstance");

const GROUP = "Route53";

const compareRoute53 = compareAws({});

const omitHostedZoneConfigComment = pipe([
  omitIfEmpty(["HostedZoneConfig.Comment"]),
  omitIfEmpty(["HostedZoneConfig"]),
]);

const dependenciesRecord = [
  { groupType: "EC2::ElasticIpAddress", path: "PublicIp" },
  { groupType: "AppRunner::Service", path: "ServiceUrl" },
];

const findRecordByValue =
  ({ resourceRecord, lives }) =>
  ({ groupType, path }) =>
    pipe([
      tap((params) => {
        assert(resourceRecord);
        assert(groupType);
        assert(path);
      }),
      () => lives,
      filter(eq(get("groupType"), groupType)),
      tap((params) => {
        assert(true);
      }),
      find(eq(get(`live.${path}`), resourceRecord.Value)),
    ])();

const getPathlive = (resource) =>
  `live.${pipe([
    () => dependenciesRecord,
    find(eq(get("groupType"), resource.groupType)),
    get("path"),
    tap((path) => {
      assert(path);
    }),
  ])()}`;

const assignResourceRecords = ({ lives, providerConfig }) =>
  pipe([
    get("ResourceRecords"),
    map((resourceRecord) =>
      pipe([
        () => dependenciesRecord,
        map(findRecordByValue({ resourceRecord, lives })),
        find(not(isEmpty)),
        switchCase([
          isEmpty,
          () => resourceRecord,
          (resource) =>
            pipe([
              () => resourceRecord,
              tap((params) => {
                assert(resource.groupType);
              }),
              assign({
                Value: pipe([
                  get("Value"),
                  replaceWithName({
                    groupType: resource.groupType,
                    path: getPathlive(resource),
                    pathLive: getPathlive(resource),
                    providerConfig,
                    lives,
                  }),
                ]),
              }),
            ])(),
        ]),
      ])()
    ),
  ]);

module.exports = pipe([
  () => [
    {
      type: "HealthCheck",
      dependencies: {
        cloudWatchAlarm: {
          type: "Alarm",
          group: "CloudWatch",
          dependencyId: ({ lives, config }) =>
            pipe([
              get("AlarmIdentifier.Name"),
              lives.getByName({
                type: "Alarm",
                group: "CloudWatch",
                config: config.providerName,
              }),
              get("id"),
            ]),
        },
        routingControl: {
          type: "RoutingControl",
          group: "Route53RecoveryControlConfig",
          dependencyId: ({ lives, config }) =>
            get("HealthCheckConfig.RoutingControlArn"),
        },
      },
      Client: Route53HealthCheck,
      compare: compareRoute53({
        filterTarget: () => pipe([() => ({})]),
        filterLive: () => pipe([() => ({})]),
      }),
      inferName:
        ({ dependenciesSpec: { routingControl } }) =>
        (properties) =>
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
          Inverted: false,
          Disabled: false,
        },
      },
      omitProperties: [
        "Id",
        "CallerReference",
        "LinkedService",
        "HealthCheckConfig.RoutingControlArn",
        "HealthCheckVersion",
      ],
    },
    {
      type: "HostedZone",
      dependencies: {
        domain: {
          type: "Domain",
          group: "Route53Domains",
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                lives.getByType({
                  type: "Domain",
                  group: "Route53Domains",
                  providerName: config.providerNames,
                }),
                find(
                  pipe([
                    get("live.DomainName"),
                    (DomainName) =>
                      pipe([
                        () => live.Name.slice(0, -1),
                        includes(DomainName),
                      ])(),
                  ])
                ),
                get("id"),
              ])(),
        },
        hostedZone: {
          type: "HostedZone",
          group: "Route53",
          ignoreOnDestroy: true,
          dependencyId:
            ({ lives, config }) =>
            (live) =>
              pipe([
                lives.getByType({
                  type: "HostedZone",
                  group: "Route53",
                  providerName: config.providerNames,
                }),
                filter(not(eq(get("live.Name"), live.Name))),
                filter(
                  pipe([
                    get("live.RecordSet"),
                    findNsRecordByName(live.Name),
                    get("ResourceRecords"),
                    first,
                    get("Value"),
                    (dnsServer) => includes(dnsServer)(findDnsServers(live)),
                  ])
                ),
                pluck("id"),
              ])(),
        },
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([get("VpcAssociations"), first, get("VPCId")]),
        },
      },
      omitProperties: ["Arn"],
      Client: Route53HostedZone,
      compare: compareRoute53({
        filterAll: () =>
          pipe([
            pick(["HostedZoneConfig.Comment"]),
            omitHostedZoneConfigComment,
          ]),
      }),
      inferName: () => get("Name"),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          pick(["Name", "HostedZoneConfig.Comment"]),
          omitHostedZoneConfigComment,
          assign({
            Name: pipe([get("Name"), replaceRegion({ lives, providerConfig })]),
          }),
        ]),
    },
    {
      type: "Record",
      dependencies: {
        hostedZone: {
          type: "HostedZone",
          group: "Route53",
          parent: true,
          dependencyId: ({ lives, config }) => get("HostedZoneId"),
        },
        healthCheck: {
          type: "healthCheck",
          group: "Route53",
          dependencyId: ({ lives, config }) => get("HealthCheckId"),
        },
        ...Route53RecordDependencies,
      },
      Client: Route53Record,
      isOurMinion: () => true,
      compare: compareRoute53Record,
      omitProperties: [],
      inferName:
        ({ dependenciesSpec }) =>
        (properties) =>
          pipe([
            () => dependenciesSpec,
            tap(() => {
              assert(dependenciesSpec);
            }),
            switchCase([
              get("appRunnerCustomDomain"),
              pipe([
                get("appRunnerCustomDomain", "noName"),
                prepend("AppRunner::CustomDomain::CNAME::"),
              ]),
              get("appRunnerCustomDomain2"),
              pipe([
                get("appRunnerCustomDomain2", "noName"),
                prepend("AppRunner::CustomDomain2::CNAME::"),
              ]),
              get("appRunnerService"),
              pipe([
                get("appRunnerService", "noName"),
                prepend("AppRunner::Service::CNAME::"),
              ]),
              get("vpcEndpoint"),
              pipe([
                () =>
                  `EC2::VpcEndpoint::${properties.Type}::${properties.Name}`,
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
              pipe([
                get("loadBalancer"),
                prepend("ElasticLoadBalancingV2::LoadBalancer::A::"),
              ]),
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
              get("transferServer"),
              pipe([
                get("transferServer"),
                prepend("Transfer::Server::CNAME::"),
              ]),
              () => `${properties.Type}::${properties.Name}`,
            ]),
            prepend(`record::`),
            when(
              () => properties.SetIdentifier,
              append(`::${properties.SetIdentifier}`)
            ),
            tap((params) => {
              assert(true);
            }),
          ])(),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          unless(
            pipe([
              get("AliasTarget.DNSName", ""),
              callProp("startsWith", "s3-website"),
            ]),
            omit(["AliasTarget.DNSName", "AliasTarget.HostedZoneId"])
          ),
          assign({
            Name: pipe([
              get("Name"),
              replaceAccountAndRegion({ lives, providerConfig }),
            ]),
            ResourceRecords: assignResourceRecords({ lives, providerConfig }),
          }),
          omitIfEmpty(["ResourceRecords"]),
          omit(["HostedZoneId"]),
        ]),
      hasNoProperty: ({ lives, resource }) =>
        pipe([
          () => resource,
          or([
            //hasDependency({ type: "LoadBalancer", group: "ElasticLoadBalancingV2" }),
            hasDependency({ type: "CustomDomain", group: "AppRunner" }),
            hasDependency({ type: "Certificate", group: "ACM" }),
            hasDependency({ type: "Distribution", group: "CloudFront" }),
            hasDependency({ type: "DomainName", group: "ApiGatewayV2" }),
            hasDependency({ type: "Server", group: "Transfer" }),
            hasDependency({
              type: "UserPoolDomain",
              group: "CognitoIdentityServiceProvider",
            }),
          ]),
        ])(),
      //TODO remove ?
      ignoreResource: () => get("cannotBeDeleted"),
    },
    createAwsService(Route53TrafficPolicy({})),
    createAwsService(Route53TrafficPolicyInstance({})),
    {
      type: "ZoneVpcAssociation",
      Client: Route53ZoneVpcAssociation,
      dependencies: {
        hostedZone: {
          type: "HostedZone",
          group: "Route53",
          parent: true,
          dependencyId: ({ lives, config }) => get("HostedZoneId"),
        },
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) => get("VPC.VPCId"),
        },
      },
      omitProperties: ["HostedZoneId", "Name", "Owner", "VPC"],
      inferName: ({ dependenciesSpec: { hostedZone, vpc } }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          () => hostedZone,
          when(isObject, get("name")),
          (hostedZone) => `zone-assoc::${hostedZone}::${vpc}`,
        ]),
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
          dependencyId: ({ lives, config }) => get("HostedZoneId"),
        },
        vpc: {
          type: "Vpc",
          group: "EC2",
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              get("VPC"),
              ({ VPCRegion, VPCId }) =>
                pipe([
                  () => VPCId,
                  lives.getById({ type: "Vpc", group: "EC2" }),
                  pick(["id", "providerName"]),
                ])(),
            ]),
        },
      },
      omitProperties: ["HostedZoneId", "VPC"],
      inferName: ({ dependenciesSpec: { hostedZone, vpc } }) =>
        pipe([
          () => vpc,
          when(isObject, get("name")),
          (vpc) => `vpc-assoc-auth::${hostedZone}::${vpc}`,
        ]),
      compare: compareRoute53({
        filterTarget: () => pipe([() => ({})]),
        filterLive: () => pipe([() => ({})]),
      }),
      // TODO region
      //filterLive: () => pick([]),
    },
  ],
  map(defaultsDeep({ group: GROUP, compare: compareRoute53({}), isOurMinion })),
]);
