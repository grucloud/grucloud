const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("LicenseManager", async function () {
  it("Association", () =>
    pipe([
      () => ({
        groupType: "LicenseManager::Association",
        livesNotFound: ({ config }) => [
          {
            LicenseConfigurationArn: `arn:${
              config.partition
            }:license-manager::${config.accountId()}:license-configuration:lic-a6c366c3b3db7df6de6aaec566d10a54`,
            ResourceArn: `arn:${config.partition}:ec2:${
              config.region
            }:${config.accountId()}:instance:i-1234567890`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Grant", () =>
    pipe([
      () => ({
        groupType: "LicenseManager::Grant",
        livesNotFound: ({ config }) => [
          {
            GrantArn: `arn:${
              config.partition
            }:license-manager::${config.accountId()}:grant:g-2b480af7877f45a7a03a340c572af5e2`,
            Version: "v1",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("GrantAccepter", () =>
    pipe([
      () => ({
        groupType: "LicenseManager::GrantAccepter",
        livesNotFound: ({ config }) => [
          {
            GrantArn: `arn:${
              config.partition
            }:license-manager::${config.accountId()}:grant:g-2b480af7877f45a7a03a340c572af5e2`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("License", () =>
    pipe([
      () => ({
        groupType: "LicenseManager::License",
        livesNotFound: ({ config }) => [
          {
            LicenseArn: `arn:${
              config.partition
            }:license-manager::${config.accountId()}:license:l-a67e8626e09f42b6a38bcc90a86821b1`,
            SourceVersion: "v1",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("LicenseConfiguration", () =>
    pipe([
      () => ({
        groupType: "LicenseManager::LicenseConfiguration",
        livesNotFound: ({ config }) => [
          {
            LicenseConfigurationArn: `arn:${
              config.partition
            }:license-manager::${config.accountId()}:license-configuration:lic-a6c366c3b3db7df6de6aaec566d10a54`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
