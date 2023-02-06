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
  it("ClassificationExportConfiguration", () =>
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
  it("CustomDataIdentifier", () =>
    pipe([
      () => ({
        groupType: "Macie2::CustomDataIdentifier",
        livesNotFound: ({ config }) => [
          { id: "12345678-1234-1234-1234-123456789012" },
        ],
      }),
      awsResourceTest,
    ])());
  it("FindingsFilter", () =>
    pipe([
      () => ({
        groupType: "Macie2::FindingsFilter",
        livesNotFound: ({ config }) => [
          { id: "12345678-1234-1234-1234-123456789012" },
        ],
      }),
      awsResourceTest,
    ])());
  it("InvitationAccepter", () =>
    pipe([
      () => ({
        groupType: "Macie2::InvitationAccepter",
        livesNotFound: ({ config }) => [
          { administratorAccountId: "123456789012" },
        ],
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
