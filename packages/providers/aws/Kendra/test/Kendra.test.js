const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Kendra", async function () {
  it("DataSource", () =>
    pipe([
      () => ({
        groupType: "Kendra::DataSource",
        livesNotFound: ({ config }) => [
          {
            Id: "6593e837-c99d-4b4e-a743-68f45fa54e9f",
            IndexId: "6593e837-c99d-4b4e-a743-68f45fa54e9f",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Experience", () =>
    pipe([
      () => ({
        groupType: "Kendra::Experience",
        livesNotFound: ({ config }) => [
          {
            Id: "6593e837-c99d-4b4e-a743-68f45fa54e9f",
            IndexId: "6593e837-c99d-4b4e-a743-68f45fa54e9f",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Faq", () =>
    pipe([
      () => ({
        groupType: "Kendra::Faq",
        livesNotFound: ({ config }) => [
          {
            Id: "6593e837-c99d-4b4e-a743-68f45fa54e9f",
            IndexId: "6593e837-c99d-4b4e-a743-68f45fa54e9f",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Index", () =>
    pipe([
      () => ({
        groupType: "Kendra::Index",
        livesNotFound: ({ config }) => [
          {
            Id: "6593e837-c99d-4b4e-a743-68f45fa54e9f",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("QuerySuggestionsBlockList", () =>
    pipe([
      () => ({
        groupType: "Kendra::QuerySuggestionsBlockList",
        livesNotFound: ({ config }) => [
          {
            Id: "6593e837-c99d-4b4e-a743-68f45fa54e9f",
            IndexId: "6593e837-c99d-4b4e-a743-68f45fa54e9f",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Thesaurus", () =>
    pipe([
      () => ({
        groupType: "Kendra::Thesaurus",
        livesNotFound: ({ config }) => [
          {
            Id: "6593e837-c99d-4b4e-a743-68f45fa54e9f",
            IndexId: "6593e837-c99d-4b4e-a743-68f45fa54e9f",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
