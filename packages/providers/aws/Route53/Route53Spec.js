const assert = require("assert");
const { tap, pipe, assign, map, pick, get, omit, or } = require("rubico");
const { when, isEmpty } = require("rubico/x");

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
      Client: Route53Record,
      isOurMinion: () => true,
      compare: compareRoute53Record,
      filterLive: () =>
        pipe([
          pick(["Name", "Type", "TTL", "ResourceRecords", "AliasTarget"]),
          tap((params) => {
            assert(true);
          }),
          //TODO omitIfEmpty(["ResourceRecords"])
          when(
            pipe([get("ResourceRecords"), isEmpty]),
            omit(["ResourceRecords"])
          ),
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
