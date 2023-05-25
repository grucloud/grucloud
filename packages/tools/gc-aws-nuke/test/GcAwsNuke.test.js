const { pipe, tap } = require("rubico");

const assert = require("assert");
const { GcAwsNuke } = require("../GcAwsNuke");

describe("GcAwsNuke", () => {
  it("list groups", async () =>
    pipe([
      tap((result) => {
        assert(true);
      }),
      () => ({ argv: ["", "", "groups"] }),
      GcAwsNuke,
      tap((result) => {
        assert(true);
      }),
    ])());
  it("list all groups", async () =>
    pipe([
      tap((result) => {
        assert(true);
      }),
      () => ({ argv: ["", "", "groups", "--all"] }),
      GcAwsNuke,
      tap((result) => {
        assert(true);
      }),
    ])());
  it("wrong-region", async () =>
    pipe([
      () => ({ argv: ["", "", "--regions", "wrong-region"] }),
      GcAwsNuke,
      tap(({ error }) => {
        assert(error);
        assert(error.message.includes("no service for region"));
      }),
    ])());
  it("wrong-profile", async () =>
    pipe([
      () => ({
        argv: ["", "", "--regions", "us-east-1", "--profile", "wrong-profile"],
      }),
      GcAwsNuke,
      tap(({ error }) => {
        assert(error.message.includes("could not be found"));
        // assert.equal(
        //   error.error.start.results[0].error.name,
        //   "CredentialsProviderError"
        // );
      }),
    ])());
});
