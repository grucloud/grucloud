const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Appflow", async function () {
  it.skip("Flow", () =>
    pipe([
      () => ({
        groupType: "Appflow::Flow",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ConnectorProfile", () =>
    pipe([
      () => ({
        groupType: "Appflow::ConnectorProfile",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
