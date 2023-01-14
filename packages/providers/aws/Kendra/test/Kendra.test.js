const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Kendra", async function () {
  it.skip("DataSource", () =>
    pipe([
      () => ({
        groupType: "Kendra::DataSource",
        livesNotFound: ({ config }) => [
          {
            // arn: `arn:aws:ivschat:${
            //   config.region
            // }:${config.accountId()}:logging-configuration/y47bQ0MmtKmd`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Experience", () =>
    pipe([
      () => ({
        groupType: "Kendra::Experience",
        livesNotFound: ({ config }) => [
          {
            // arn: `arn:aws:ivschat:${
            //   config.region
            // }:${config.accountId()}:room/32no4tl70Fmr`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Faq", () =>
    pipe([
      () => ({
        groupType: "Kendra::Faq",
        livesNotFound: ({ config }) => [
          {
            // arn: `arn:aws:ivschat:${
            //   config.region
            // }:${config.accountId()}:room/32no4tl70Fmr`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Index", () =>
    pipe([
      () => ({
        groupType: "Kendra::Index",
        livesNotFound: ({ config }) => [
          {
            // arn: `arn:aws:ivschat:${
            //   config.region
            // }:${config.accountId()}:room/32no4tl70Fmr`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("QuerySuggestionsBlockList", () =>
    pipe([
      () => ({
        groupType: "Kendra::QuerySuggestionsBlockList",
        livesNotFound: ({ config }) => [
          {
            // arn: `arn:aws:ivschat:${
            //   config.region
            // }:${config.accountId()}:room/32no4tl70Fmr`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
