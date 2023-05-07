const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("OpenSearchServerless", async function () {
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
  it("SecurityConfig", () =>
    pipe([
      () => ({
        groupType: "OpenSearchServerless::SecurityConfig",
        livesNotFound: ({ config }) => [
          { id: "saml/840541460064/mysamlprovider" },
        ],
      }),
      awsResourceTest,
    ])());
  it("SecurityPolicy", () =>
    pipe([
      () => ({
        groupType: "OpenSearchServerless::SecurityPolicy",
        livesNotFound: ({ config }) => [{ name: "s123", type: "encryption" }],
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
