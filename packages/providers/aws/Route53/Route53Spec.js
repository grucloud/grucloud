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
const { prepend, isEmpty, find } = require("rubico/x");
const { omitIfEmpty, buildGetId } = require("@grucloud/core/Common");
const { hasDependency } = require("@grucloud/core/generatorUtils");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { Route53HostedZone } = require("./Route53HostedZone");
const { Route53Record, compareRoute53Record } = require("./Route53Record");
const defaultsDeep = require("rubico/x/defaultsDeep");

const GROUP = "Route53";

const compareRoute53 = compareAws({});

module.exports = pipe([
  () => [
    {
      type: "HostedZone",
      dependencies: {
        domain: { type: "Domain", group: "Route53Domains" },
        hostedZone: {
          type: "HostedZone",
          group: "Route53",
          ignoreOnDestroy: true,
        },
      },
      Client: Route53HostedZone,
      compare: compareRoute53({
        filterTarget: () => pipe([() => ({})]),
        filterLive: () => pipe([() => ({})]),
      }),
      filterLive: () => pick([]),
      includeDefaultDependencies: true,
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
      },
      Client: Route53Record,
      isOurMinion: () => true,
      compare: compareRoute53Record,
      inferName: ({ properties, dependenciesSpec }) =>
        pipe([
          () => dependenciesSpec,
          tap(() => {
            assert(dependenciesSpec);
          }),
          switchCase([
            get("elasticIpAddress"),
            pipe([
              get("elasticIpAddress", "noName"),
              prepend("EC2::ElasticIpAddress::"),
            ]),
            get("certificate"),
            pipe([get("certificate"), prepend("ACM::Certificate::")]),
            get("userPoolDomain"),
            pipe([
              get("userPoolDomain"),
              prepend("CognitoIdentityServiceProvider::UserPoolDomain::"),
            ]),
            get("loadBalancer"),
            pipe([get("loadBalancer"), prepend("ELBv2::LoadBalancer::")]),
            get("distribution"),
            pipe([get("distribution"), prepend("CloudFront::Distribution::")]),
            get("apiGatewayV2DomainName"),
            pipe([
              get("apiGatewayV2DomainName"),
              prepend("ApiGatewayV2::DomainName::"),
            ]),
            () => `${properties.Name}::${properties.Type}`,
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
