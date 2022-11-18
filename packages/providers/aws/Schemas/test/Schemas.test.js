const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Schemas", async function () {
  it.skip("Discoverer", () =>
    pipe([
      () => ({
        groupType: "Schemas::Discoverer",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Registry", () =>
    pipe([
      () => ({
        groupType: "Schemas::Registry",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("RegistryPolicy", () =>
    pipe([
      () => ({
        groupType: "Schemas::RegistryPolicy",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Schema", () =>
    pipe([
      () => ({
        groupType: "Schemas::Schema",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
