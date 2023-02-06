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
  it("NamedQuery", () =>
    pipe([
      () => ({
        groupType: "Athena::NamedQuery",
        livesNotFound: ({ config }) => [{ NamedQueryId: "n123" }],
      }),
      awsResourceTest,
    ])());
  it("PreparedStatement", () =>
    pipe([
      () => ({
        groupType: "Athena::PreparedStatement",
        livesNotFound: ({ config }) => [
          { StatementName: "d123", WorkGroup: "w123" },
        ],
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
