const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Account", async function () {
  it("AccountAlternateAccount", () =>
    pipe([
      () => ({
        groupType: "Account::AlternateAccount",
        skipDelete: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it.skip("ContactInformation", () =>
    pipe([
      () => ({
        groupType: "Account::ContactInformation",
        skipDelete: true,
      }),
      awsResourceTest,
    ])());
});
