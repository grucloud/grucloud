const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Macie2", async function () {
  it.skip("Account", () =>
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
  it.skip("ClassificationJob", () =>
    pipe([
      () => ({
        groupType: "Macie2::ClassificationJob",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("CustomDataIdentifier", () =>
    pipe([
      () => ({
        groupType: "Macie2::CustomDataIdentifier",
        livesNotFound: ({ config }) => [{}],
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
  it.skip("Member", () =>
    pipe([
      () => ({
        groupType: "Macie2::Member",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("OrganizationAdminAccount", () =>
    pipe([
      () => ({
        groupType: "Macie2::OrganizationAdminAccount",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
