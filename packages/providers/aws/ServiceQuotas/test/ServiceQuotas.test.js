const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ServiceQuotas", async function () {
  it.skip("ServiceQuota", () =>
    pipe([
      () => ({
        groupType: "ServiceQuotas::ServiceQuota",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
