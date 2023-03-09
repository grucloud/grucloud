const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("WorkSpacesWeb", async function () {
  it.skip("BrowserSettings", () =>
    pipe([
      () => ({
        groupType: "WorkSpacesWeb::BrowserSettings",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("NetworkSettings", () =>
    pipe([
      () => ({
        groupType: "WorkSpacesWeb::NetworkSettings",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Portal", () =>
    pipe([
      () => ({
        groupType: "WorkSpacesWeb::Portal",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("TrustStore", () =>
    pipe([
      () => ({
        groupType: "WorkSpacesWeb::TrustStore",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("UserSettings", () =>
    pipe([
      () => ({
        groupType: "WorkSpacesWeb::UserSettings",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
