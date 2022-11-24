const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Appflow", async function () {
  it("Flow", () =>
    pipe([
      () => ({
        groupType: "Appflow::Flow",
        livesNotFound: ({ config }) => [{ flowName: "123" }],
      }),
      awsResourceTest,
    ])());
  it("ConnectorProfile", () =>
    pipe([
      () => ({
        groupType: "Appflow::ConnectorProfile",
        livesNotFound: ({ config }) => [{ connectorProfileName: "m123" }],
      }),
      awsResourceTest,
    ])());
});
