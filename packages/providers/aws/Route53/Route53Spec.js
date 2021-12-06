const assert = require("assert");
const {
  tap,
  pipe,
  assign,
  map,
  pick,
  get,
  omit,
  or,
  switchCase,
} = require("rubico");
const { prepend } = require("rubico/x");
const { omitIfEmpty } = require("@grucloud/core/Common");

const { isOurMinion } = require("../AwsCommon");
const { Route53HostedZone, compareHostedZone } = require("./Route53HostedZone");
const { Route53Record, compareRoute53Record } = require("./Route53Record");
const { hasDependency } = require("@grucloud/core/generatorUtils");

const GROUP = "Route53";

module.exports = () =>
  map(assign({ group: () => GROUP }))([
    {
      type: "HostedZone",
      dependsOn: ["Route53Domains::Domain"],
      Client: Route53HostedZone,
      isOurMinion,
      compare: compareHostedZone,
      filterLive: () => pick([]),
      includeDefaultDependencies: true,
      dependencies: () => ({
        domain: { type: "Domain", group: "Route53Domains" },
        hostedZone: { type: "HostedZone", group: "Route53" },
      }),
    },
    {
      type: "Record",
      dependsOn: ["Route53::HostedZone", "ACM::Certificate"],
      dependsOnList: ["Route53::HostedZone"],
      Client: Route53Record,
      isOurMinion: () => true,
      compare: compareRoute53Record,
      inferName: ({ properties, dependencies }) =>
        pipe([
          dependencies,
          tap((params) => {
            assert(true);
          }),
          switchCase([
            get("certificate"),
            pipe([get("certificate.name"), prepend("ACM::Certificate::")]),
            get("loadBalancer"),
            pipe([get("loadBalancer.name"), prepend("ELBv2::LoadBalancer::")]),
            get("distribution"),
            pipe([
              get("distribution.name"),
              prepend("CloudFront::Distribution::"),
            ]),
            get("apiGatewayDomainName"),
            pipe([
              get("apiGatewayDomainName.name"),
              prepend("APIGateway::DomainName::"),
            ]),
            get("apiGatewayV2DomainName"),
            pipe([
              get("apiGatewayV2DomainName.name"),
              prepend("ApiGatewayV2::DomainName::"),
            ]),
            () => "",
          ]),
          prepend("record::"),
          tap((params) => {
            assert(true);
          }),
        ])(),
      filterLive: () =>
        pipe([
          pick(["Name", "Type", "TTL", "ResourceRecords", "AliasTarget"]),
          omitIfEmpty(["ResourceRecords"]),
        ]),
      hasNoProperty: ({ lives, resource }) =>
        pipe([
          () => resource,
          or([
            hasDependency({ type: "LoadBalancer", group: "ELBv2" }),
            hasDependency({ type: "Certificate", group: "ACM" }),
            hasDependency({ type: "Distribution", group: "CloudFront" }),
            hasDependency({ type: "DomainName", group: "APIGateway" }),
            hasDependency({ type: "DomainName", group: "ApiGatewayV2" }),
          ]),
        ])(),
      dependencies: () => ({
        hostedZone: { type: "HostedZone", group: "Route53" },
        loadBalancer: { type: "LoadBalancer", group: "ELBv2" },
        certificate: { type: "Certificate", group: "ACM" },
        distribution: { type: "Distribution", group: "CloudFront" },
        apiGatewayV2DomainName: { type: "DomainName", group: "ApiGatewayV2" },
        apiGatewayDomainName: { type: "DomainName", group: "APIGateway" },
      }),
      //TODO remove ?
      ignoreResource: () => get("cannotBeDeleted"),
    },
  ]);
