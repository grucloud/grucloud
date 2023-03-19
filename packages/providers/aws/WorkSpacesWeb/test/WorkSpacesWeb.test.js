const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("WorkSpacesWeb", async function () {
  it("BrowserSettings", () =>
    pipe([
      () => ({
        groupType: "WorkSpacesWeb::BrowserSettings",
        livesNotFound: ({ config }) => [
          {
            browserSettingsArn: `arn:aws:workspaces-web:${
              config.region
            }:${config.accountId()}:browserSettings/dc06c8cb-be70-43a8-aba1-0d70fd47e7d1`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("IdentityProvider", () =>
    pipe([
      () => ({
        groupType: "WorkSpacesWeb::IdentityProvider",
        livesNotFound: ({ config }) => [
          {
            identityProviderArn: `arn:aws:workspaces-web:${
              config.region
            }:${config.accountId()}:identityProvider/dc06c8cb-be70-43a8-aba1-0d70fd47e7d1`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("NetworkSettings", () =>
    pipe([
      () => ({
        groupType: "WorkSpacesWeb::NetworkSettings",
        livesNotFound: ({ config }) => [
          {
            networkSettingsArn: `arn:aws:workspaces-web:${
              config.region
            }:${config.accountId()}:networkSettings/dc06c8cb-be70-43a8-aba1-0d70fd47e7d1`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Portal", () =>
    pipe([
      () => ({
        groupType: "WorkSpacesWeb::Portal",
        livesNotFound: ({ config }) => [
          {
            portalArn: `arn:aws:workspaces-web:${
              config.region
            }:${config.accountId()}:portal/0e3de158-d2a8-4423-be6e-e68eb8800b3a`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("TrustStore", () =>
    pipe([
      () => ({
        groupType: "WorkSpacesWeb::TrustStore",
        livesNotFound: ({ config }) => [
          {
            trustStoreArn: `arn:aws:workspaces-web:${
              config.region
            }:${config.accountId()}:trustStore/a6b659c1-eca8-4a15-86b0-ca6929156241`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("UserAccessLoggingSettings", () =>
    pipe([
      () => ({
        groupType: "WorkSpacesWeb::UserAccessLoggingSettings",
        livesNotFound: ({ config }) => [
          {
            userAccessLoggingSettingsArn: `arn:aws:workspaces-web:${
              config.region
            }:${config.accountId()}:userAccessLoggingSettings/a6b659c1-eca8-4a15-86b0-ca6929156241`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("UserSettings", () =>
    pipe([
      () => ({
        groupType: "WorkSpacesWeb::UserSettings",
        livesNotFound: ({ config }) => [
          {
            userSettingsArn: `arn:aws:workspaces-web:${
              config.region
            }:${config.accountId()}:userSettings/a6b659c1-eca8-4a15-86b0-ca6929156241`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
