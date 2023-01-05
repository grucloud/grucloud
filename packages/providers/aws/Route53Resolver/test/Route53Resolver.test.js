const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Route53Resolver", async function () {
  it("Config", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::Config",
        livesNotFound: ({ config }) => [{ ResourceId: "vpc-123456" }],
      }),
      awsResourceTest,
    ])());
  it("DnssecConfig", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::DnssecConfig",
        livesNotFound: ({ config }) => [{ ResourceId: "vpc-123456" }],
      }),
      awsResourceTest,
    ])());
  it("Endpoint", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::Endpoint",
        livesNotFound: ({ config }) => [{ Id: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("FirewallConfig", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::FirewallConfig",
        livesNotFound: ({ config }) => [{ ResourceId: "vpc-123456" }],
      }),
      awsResourceTest,
    ])());
  it("FirewallDomainList", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::FirewallDomainList",
        livesNotFound: ({ config }) => [{ FirewallDomainListId: "f123" }],
      }),
      awsResourceTest,
    ])());
  it("FirewallRule", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::FirewallRule",
        livesNotFound: ({ config }) => [
          {
            Name: "r1",
            FirewallRuleGroupId: "f123",
            FirewallDomainListId: "fd123",
          },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("FirewallRuleGroup", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::FirewallRuleGroup",
        livesNotFound: ({ config }) => [{ FirewallRuleGroupId: "f123" }],
      }),
      awsResourceTest,
    ])());
  it("FirewallRuleGroupAssociation", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::FirewallRuleGroupAssociation",
        livesNotFound: ({ config }) => [
          {
            FirewallRuleGroupAssociationId: "f123",
            FirewallRuleGroupId: "rg123",
            VpcId: "vpc-123456",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Rule", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::Rule",
        livesNotFound: ({ config }) => [{ Id: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("RuleAssociation", () =>
    pipe([
      () => ({
        groupType: "Route53Resolver::RuleAssociation",
        livesNotFound: ({ config }) => [
          { Id: "12345", ResolverRuleId: "12345", VPCId: "vpc-xx" },
        ],
      }),
      awsResourceTest,
    ])());
});
