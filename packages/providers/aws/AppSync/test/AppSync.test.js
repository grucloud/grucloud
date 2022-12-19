const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AppSync", async function () {
  it("DataSource", () =>
    pipe([
      () => ({
        groupType: "AppSync::DataSource",
        livesNotFound: ({ config }) => [
          {
            name: "datasource-no-exist",
            apiId: "inm4iqehhjdf5hhsuqmk7bq35t",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Function", () =>
    pipe([
      () => ({
        groupType: "AppSync::Function",
        livesNotFound: ({ config }) => [
          {
            apiId: "12345",
            functionId: "f123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("GraphqlApi", () =>
    pipe([
      () => ({
        groupType: "AppSync::GraphqlApi",
        livesNotFound: ({ config }) => [
          {
            apiId: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Resolver", () =>
    pipe([
      () => ({
        groupType: "AppSync::Resolver",
        livesNotFound: ({ config }) => [
          {
            typeName: "typeName-no-exist",
            fieldName: "fieldName-no-exist",
            apiId: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
