const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe.only("OpenSearchServerless", async function () {
  it("AccessPolicy", () =>
    pipe([
      () => ({
        groupType: "OpenSearchServerless::AccessPolicy",
        livesNotFound: ({ config }) => [{ name: "p123", type: "data" }],
      }),
      awsResourceTest,
    ])());
  it("Collection", () =>
    pipe([
      () => ({
        groupType: "OpenSearchServerless::Collection",
        livesNotFound: ({ config }) => [{ id: "123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("SecurityConfig", () =>
    pipe([
      () => ({
        groupType: "OpenSearchServerless::SecurityConfig",
        livesNotFound: ({ config }) => [{ id: "s123" }],
      }),
      awsResourceTest,
    ])());
  it("SecurityPolicy", () =>
    pipe([
      () => ({
        groupType: "OpenSearchServerless::SecurityPolicy",
        livesNotFound: ({ config }) => [{ id: "s123", type: "encryption" }],
      }),
      awsResourceTest,
    ])());
  it("VpcEndpoint", () =>
    pipe([
      () => ({
        groupType: "OpenSearchServerless::VpcEndpoint",
        livesNotFound: ({ config }) => [{ id: "vpce-12345" }],
      }),
      awsResourceTest,
    ])());
});
