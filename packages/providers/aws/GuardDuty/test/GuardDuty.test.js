const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("GuardDuty", async function () {
  it("Detector", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::Detector",
        livesNotFound: ({ config }) => [
          { DetectorId: "6ec26c9c512c30d9260aeb71fdb9a9db" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Filter", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::Filter",
        livesNotFound: ({ config }) => [
          {
            DetectorId: "6ec26c9c512c30d9260aeb71fdb9a9db",
            FilterName: "f123",
          },
        ],
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
  it("IpSet", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::IPSet",
        livesNotFound: ({ config }) => [
          { DetectorId: "6ec26c9c512c30d9260aeb71fdb9a9db", IpSetId: "ip123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Member", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::Member",
        livesNotFound: ({ config }) => [
          {
            DetectorId: "6ec26c9c512c30d9260aeb71fdb9a9db",
            AccountId: "1234567890",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("OrganizationAdminAccount", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::OrganizationAdminAccount",
        livesNotFound: ({ config }) => [{ AdminAccountId: "1234567890" }],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("OrganizationConfiguration", () =>
    pipe([
      () => ({
        groupType: "GuardDuty::OrganizationConfiguration",
        livesNotFound: ({ config }) => [
          { DetectorId: "6ec26c9c512c30d9260aeb71fdb9a9db" },
        ],
        skipDelete: true,
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
