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
  it("CertificateAuthority", () =>
    pipe([
      () => ({
        groupType: "ACMPCA::CertificateAuthority",
        livesNotFound: ({ config }) => [
          {
            CertificateAuthorityArn: `arn:${config.partition}:acm-pca:${
              config.region
            }:${config.accountId()}:certificate-authority/12345678-1234-1234-1234-123456789012`,
          },
        ],
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
  it("Permission", () =>
    pipe([
      () => ({
        groupType: "ACMPCA::Permission",
        livesNotFound: ({ config }) => [
          {
            CertificateAuthorityArn: `arn:${config.partition}:acm-pca:${
              config.region
            }:${config.accountId()}:certificate-authority/12345678-1234-1234-1234-123456789012`,
            Principal: "acm.amazonaws.com",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Policy", () =>
    pipe([
      () => ({
        groupType: "ACMPCA::Policy",
        livesNotFound: ({ config }) => [
          {
            ResourceArn: `arn:${config.partition}:acm-pca:${
              config.region
            }:${config.accountId()}:certificate-authority/12345678-1234-1234-1234-123456789012`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
