const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Schemas", async function () {
  it("Discoverer", () =>
    pipe([
      () => ({
        groupType: "Schemas::Discoverer",
        livesNotFound: ({ config }) => [{ DiscovererId: "d123" }],
      }),
      awsResourceTest,
    ])());
  it("Registry", () =>
    pipe([
      () => ({
        groupType: "Schemas::Registry",
        livesNotFound: ({ config }) => [{ RegistryName: "r123" }],
      }),
      awsResourceTest,
    ])());
  it("RegistryPolicy", () =>
    pipe([
      () => ({
        groupType: "Schemas::RegistryPolicy",
        livesNotFound: ({ config }) => [{ RegistryName: "123" }],
      }),
      awsResourceTest,
    ])());
  it("Schema", () =>
    pipe([
      () => ({
        groupType: "Schemas::Schema",
        livesNotFound: ({ config }) => [
          { SchemaName: "s123", RegistryName: "r13" },
        ],
      }),
      awsResourceTest,
    ])());
});
