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
            browserSettingsArn: `arn:${config.partition}:workspaces-web:${
              config.region
            }:${config.accountId()}:browserSettings/dc06c8cb-be70-43a8-aba1-0d70fd47e7d1`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("IdentityProvider", () =>
    pipe([
      // TODO  Invalid Request. The provided identity provider ARN is invalid
      () => ({
        groupType: "WorkSpacesWeb::IdentityProvider",
        livesNotFound: ({ config }) => [
          {
            identityProviderArn: `arn:${config.partition}:workspaces-web:${
              config.region
            }:${config.accountId()}:identityProvider/-1EFcD1F--5b2a2F17EB38A080b9b7cabdCA/45EA0-dFde6a42cd72D2f-daFcbcdbd9D47B/2d18e991f9dBD50c6f8cAeaf0F80E9cFa28-/FD93dE5Fb931dCAcc62-d-cb95E674b5-afA/1D1585b9F6e6CC2efCaf2E9d5ef1-e6eA56A/f2a8269a2A2DfC04bAbcE23FFF0c52Bbaa19/46ff6db3bDCf6f-E9643AA8D-e51A--b13e9/5d-26Ef49ff56f2bE8d0B6f8bf7F7C8fA18B`,
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
            networkSettingsArn: `arn:${config.partition}:workspaces-web:${
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
            portalArn: `arn:${config.partition}:workspaces-web:${
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
            trustStoreArn: `arn:${config.partition}:workspaces-web:${
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
            userAccessLoggingSettingsArn: `arn:${
              config.partition
            }:workspaces-web:${
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
            userSettingsArn: `arn:${config.partition}:workspaces-web:${
              config.region
            }:${config.accountId()}:userSettings/a6b659c1-eca8-4a15-86b0-ca6929156241`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
