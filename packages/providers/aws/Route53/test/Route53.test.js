const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Route53", async function () {
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
