const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Glue", async function () {
  it.skip("CatalogDatabase", () =>
    pipe([
      () => ({
        groupType: "Glue::CatalogDatabase",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("CatalogTable", () =>
    pipe([
      () => ({
        groupType: "Glue::CatalogTable",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Classifier", () =>
    pipe([
      () => ({
        groupType: "Glue::Classifier",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Connection", () =>
    pipe([
      () => ({
        groupType: "Glue::Connection",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Crawler", () =>
    pipe([
      () => ({
        groupType: "Glue::Crawler",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("DevEndpoint", () =>
    pipe([
      () => ({
        groupType: "Glue::Crawler",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Job", () =>
    pipe([
      () => ({
        groupType: "Glue::Job",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Partition", () =>
    pipe([
      () => ({
        groupType: "Glue::Partition",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Registry", () =>
    pipe([
      () => ({
        groupType: "Glue::Registry",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("ResourcePolicy", () =>
    pipe([
      () => ({
        groupType: "Glue::ResourcePolicy",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("SecurityConfiguration", () =>
    pipe([
      () => ({
        groupType: "Glue::SecurityConfiguration",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Trigger", () =>
    pipe([
      () => ({
        groupType: "Glue::Trigger",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("UserDefinedFunction", () =>
    pipe([
      () => ({
        groupType: "Glue::UserDefinedFunction",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Workflow", () =>
    pipe([
      () => ({
        groupType: "Glue::Workflow",
        livesNotFound: ({ config }) => [
          {
            Name: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
