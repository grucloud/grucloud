const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Athena", async function () {
  it("DataCatalog", () =>
    pipe([
      () => ({
        groupType: "Athena::DataCatalog",
        livesNotFound: ({ config }) => [{ Name: "d123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Database", () =>
    pipe([
      () => ({
        groupType: "Athena::Database",
        livesNotFound: ({ config }) => [{ Name: "d123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("NamedQuery", () =>
    pipe([
      () => ({
        groupType: "Athena::NamedQuery",
        livesNotFound: ({ config }) => [{ Name: "d123" }],
      }),
      awsResourceTest,
    ])());
  it("WorkGroup", () =>
    pipe([
      () => ({
        groupType: "Athena::WorkGroup",
        livesNotFound: ({ config }) => [{ WorkGroup: "w123" }],
      }),
      awsResourceTest,
    ])());
});
