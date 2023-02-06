const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Schemas", async function () {
  it("Discoverer", () =>
    pipe([
      () => ({
        groupType: "EventSchemas::Discoverer",
        livesNotFound: ({ config }) => [{ DiscovererId: "d123" }],
      }),
      awsResourceTest,
    ])());
  it("Registry", () =>
    pipe([
      () => ({
        groupType: "EventSchemas::Registry",
        livesNotFound: ({ config }) => [{ RegistryName: "r123" }],
      }),
      awsResourceTest,
    ])());
  it("RegistryPolicy", () =>
    pipe([
      () => ({
        groupType: "EventSchemas::RegistryPolicy",
        livesNotFound: ({ config }) => [{ RegistryName: "123" }],
      }),
      awsResourceTest,
    ])());
  it("Schema", () =>
    pipe([
      () => ({
        groupType: "EventSchemas::Schema",
        livesNotFound: ({ config }) => [
          { SchemaName: "s123", RegistryName: "r13" },
        ],
      }),
      awsResourceTest,
    ])());
});
