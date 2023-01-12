const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Route53Domains", async function () {
  it("Domain", () =>
    pipe([
      () => ({
        groupType: "Route53Domains::Domain",
        //livesNotFound: ({ config }) => [{}],
        skipGetByName: true,
        skipDelete: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
});
