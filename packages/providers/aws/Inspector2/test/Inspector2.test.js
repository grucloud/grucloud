const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Inspector2", async function () {
  it("DelegatedAdminAccount", () =>
    pipe([
      () => ({
        groupType: "Inspector2::DelegatedAdminAccount",
        livesNotFound: ({ config }) => [
          { delegatedAdminAccountId: "123456789012" },
        ],
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("Enabler", () =>
    pipe([
      () => ({
        groupType: "Inspector2::Enabler",
        livesNotFound: ({ config }) => [{}],
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it.skip("MemberAssociation", () =>
    pipe([
      () => ({
        groupType: "Inspector2::MemberAssociation",
        livesNotFound: ({ config }) => [{}],
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("OrganizationConfiguration", () =>
    pipe([
      () => ({
        groupType: "Inspector2::OrganizationConfiguration",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
