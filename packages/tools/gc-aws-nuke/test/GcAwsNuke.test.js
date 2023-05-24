const { describe, it, test } = require("node:test");
const { pipe, tap } = require("rubico");

const assert = require("assert");
const { GcAwsNuke } = require("../GcAwsNuke");

describe("GcAwsNuke", () => {
  it("help", async () =>
    pipe([
      () => ({ argv: ["", "", "--help"] }),
      GcAwsNuke,
      tap((result) => {
        assert(true);
      }),
    ])());
  it("wrong-region", { only: true }, async () =>
    pipe([
      () => ({ argv: ["", "", "--regions", "wrong-region"] }),
      GcAwsNuke,
      tap((result) => {
        assert(true);
        assert(result.error.message.includes("no service for region"));
      }),
    ])()
  );
  it("wrong-profile", async () =>
    pipe([
      () => ({
        argv: ["", "", "--regions", "us-east-1", "--profile", "wrong-profile"],
      }),
      GcAwsNuke,
      tap(({ error }) => {
        assert(error.error.start.error);
        assert.equal(
          error.error.start.results[0].error.name,
          "CredentialsProviderError"
        );
      }),
    ])());
});
