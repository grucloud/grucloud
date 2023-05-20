const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Route53", async function () {
  it("CidrCollection", () =>
    pipe([
      () => ({
        groupType: "Route53::CidrCollection",
        livesNotFound: ({ config }) => [
          { Id: "12345678-1234-1234-1234-123456789012" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("CidrLocation", () =>
    pipe([
      () => ({
        groupType: "Route53::CidrCollection",
        livesNotFound: ({ config }) => [
          { Id: "12345678-1234-1234-1234-123456789012" },
        ],
      }),
      awsResourceTest,
    ])());
  it("DelegationSet", () =>
    pipe([
      () => ({
        groupType: "Route53::DelegationSet",
        livesNotFound: ({ config }) => [{ Id: "a-12345" }],
      }),
      awsResourceTest,
    ])());
  it.skip("KeySigningKey", () =>
    pipe([
      () => ({
        groupType: "Route53::KeySigningKey",
        livesNotFound: ({ config }) => [{ Id: "QS1234567" }],
        skipGetByName: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("HealthCheck", () =>
    pipe([
      () => ({
        groupType: "Route53::HealthCheck",
        livesNotFound: ({ config }) => [{ Id: "a-12345" }],
      }),
      awsResourceTest,
    ])());
  it("HostedZone", () =>
    pipe([
      () => ({
        groupType: "Route53::HostedZone",
        livesNotFound: ({ config }) => [{ Id: "QS1234567" }],
        skipGetByName: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it.skip("HostedZoneDnSec", () =>
    pipe([
      () => ({
        groupType: "Route53::HostedZoneDnSec",
        livesNotFound: ({ config }) => [{ Id: "QS1234567" }],
        skipGetByName: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("QueryLog", () =>
    pipe([
      () => ({
        groupType: "Route53::QueryLog",
        livesNotFound: ({ config }) => [{ Id: "QS1234567" }],
      }),
      awsResourceTest,
    ])());
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listTrafficPolicies-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createTrafficPolicy-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createTrafficPolicyVersion-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteTrafficPolicy-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getTrafficPolicy-property
  it("TrafficPolicy", () =>
    pipe([
      () => ({
        groupType: "Route53::TrafficPolicy",
        livesNotFound: ({ config }) => [{ Id: "i123", Version: "123" }],
      }),
      awsResourceTest,
    ])());

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#listTrafficPolicyInstancesByHostedZone-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#deleteTrafficPolicyInstance-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#createTrafficPolicyInstance-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53.html#getTrafficPolicyInstance-property
  it("TrafficPolicyInstance", () =>
    pipe([
      () => ({
        groupType: "Route53::TrafficPolicyInstance",
        livesNotFound: ({ config }) => [{ Id: "i123" }],
      }),
      awsResourceTest,
    ])());
  it("Record", () =>
    pipe([
      () => ({
        groupType: "Route53::Record",
        livesNotFound: ({ config }) => [{}],
        skipGetByName: true,
        skipDelete: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("VpcAssociationAuthorization", () =>
    pipe([
      () => ({
        groupType: "Route53::VpcAssociationAuthorization",
        livesNotFound: ({ config }) => [
          { HostedZoneId: "QS1234567", VPC: { VpcId: "vpc-123" } },
        ],
        skipGetByName: true,
        skipDelete: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("ZoneVpcAssociation", () =>
    pipe([
      () => ({
        groupType: "Route53::ZoneVpcAssociation",
        livesNotFound: ({ config }) => [
          { HostedZoneId: "QS1234567", VPC: { VpcId: "vpc-123" } },
        ],
        skipGetByName: true,
        skipDelete: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
});
