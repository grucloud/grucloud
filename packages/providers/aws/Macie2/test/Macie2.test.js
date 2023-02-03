const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Macie2", async function () {
  it("Account", () =>
    pipe([
      () => ({
        groupType: "Macie2::Account",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ClassificationExportConfiguration", () =>
    pipe([
      () => ({
        groupType: "Macie2::ClassificationExportConfiguration",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("ClassificationJob", () =>
    pipe([
      () => ({
        groupType: "Macie2::ClassificationJob",
        livesNotFound: ({ config }) => [{ jobId: "job-123" }],
        skipDelete: true,
      }),
      awsResourceTest,
    ])());
  it.skip("CustomDataIdentifier", () =>
    pipe([
      () => ({
        groupType: "Macie2::CustomDataIdentifier",
        livesNotFound: ({ config }) => [{ id: "123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("FindingsFilter", () =>
    pipe([
      () => ({
        groupType: "Macie2::FindingsFilter",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("InvitationAccepter", () =>
    pipe([
      () => ({
        groupType: "Macie2::InvitationAccepter",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Member", () =>
    pipe([
      () => ({
        groupType: "Macie2::Member",
        livesNotFound: ({ config }) => [{ accountId: "123456789012" }],
      }),
      awsResourceTest,
    ])());
  it("OrganizationAdminAccount", () =>
    pipe([
      () => ({
        groupType: "Macie2::OrganizationAdminAccount",
        livesNotFound: ({ config }) => [{ adminAccountId: "123456789012" }],
      }),
      awsResourceTest,
    ])());
});
