const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("GuardDuty", async function () {
  it.skip("Detector", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::Detector",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Filter", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::Filter",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("InviteAccepter", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::InviteAccepter",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("IpSet", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::IpSet",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Member", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::Member",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("OrganizationAdminAccount", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::OrganizationAdminAccount",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("OrganizationConfiguration", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::OrganizationConfiguration",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("PublishingDestination", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::PublishingDestination",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ThreatIntelSet", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::ThreatIntelSet",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
