const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Organisations", async function () {
  it("Account", () =>
    pipe([
      () => ({
        groupType: "Organisations::Account",
        livesNotFound: ({ config }) => [{ AccountId: "123456789012" }],
      }),
      awsResourceTest,
    ])());
  it("Organisation", () =>
    pipe([
      () => ({
        groupType: "Organisations::Organisation",
        livesNotFound: ({ config }) => [{}],
        skipDelete: true,
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("OrganisationalUnit", () =>
    pipe([
      () => ({
        groupType: "Organisations::OrganisationalUnit",
        livesNotFound: ({ config }) => [{ Id: "ou-941x-2jykk4x1" }],
      }),
      awsResourceTest,
    ])());
  it("Policy", () =>
    pipe([
      () => ({
        groupType: "Organisations::Policy",
        livesNotFound: ({ config }) => [{ PolicyId: "p-783rdhim" }],
      }),
      awsResourceTest,
    ])());
  it("PolicyAttachment", () =>
    pipe([
      () => ({
        groupType: "Organisations::PolicyAttachment",
        livesNotFound: ({ config }) => [
          { PolicyId: "p-783rdhim", TargetId: "161408406883" },
        ],
        //TODO
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("Root", () =>
    pipe([
      () => ({
        groupType: "Organisations::Root",
        livesNotFound: ({ config }) => [{}],
        skipDelete: true,
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
});
