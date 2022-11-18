const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ACMPCA", async function () {
  it.skip("Certificate", () =>
    pipe([
      () => ({
        groupType: "ACMPCA::Certificate",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("CertificateAuthority", () =>
    pipe([
      () => ({
        groupType: "ACMPCA::CertificateAuthority",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("CertificateAuthorityCertificate", () =>
    pipe([
      () => ({
        groupType: "ACMPCA::CertificateAuthorityCertificate",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Permisison", () =>
    pipe([
      () => ({
        groupType: "ACMPCA::Permisison",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Policy", () =>
    pipe([
      () => ({
        groupType: "ACMPCA::Policy",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
