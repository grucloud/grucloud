const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Pinpoint", async function () {
  it.skip("ApplicationSettings", () =>
    pipe([
      () => ({
        groupType: "Pinpoint::ApplicationSettings",
        livesNotFound: ({ config }) => [{ ApplicationId: "a1234567" }],
      }),
      awsResourceTest,
    ])());
  it("App", () =>
    pipe([
      () => ({
        groupType: "Pinpoint::App",
        livesNotFound: ({ config }) => [{ ApplicationId: "a1234567" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Campaign", () =>
    pipe([
      () => ({
        groupType: "Pinpoint::Campaign",
        livesNotFound: ({ config }) => [{ ApplicationId: "a1234567" }],
      }),
      awsResourceTest,
    ])());
  it("EmailChannel", () =>
    pipe([
      () => ({
        groupType: "Pinpoint::EmailChannel",
        livesNotFound: ({ config }) => [{ ApplicationId: "a1234567" }],
      }),
      awsResourceTest,
    ])());
  it.skip("EmailTemplate", () =>
    pipe([
      () => ({
        groupType: "Pinpoint::EmailTemplate",
        livesNotFound: ({ config }) => [{ ApplicationId: "a1234567" }],
      }),
      awsResourceTest,
    ])());
  it("EventStream", () =>
    pipe([
      () => ({
        groupType: "Pinpoint::EventStream",
        livesNotFound: ({ config }) => [{ ApplicationId: "a1234567" }],
      }),
      awsResourceTest,
    ])());
  it.skip("VoiceChannel", () =>
    pipe([
      () => ({
        groupType: "Pinpoint::SMSTemplate",
        livesNotFound: ({ config }) => [{ ApplicationId: "a1234567" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Segment", () =>
    pipe([
      () => ({
        groupType: "Pinpoint::Segment",
        livesNotFound: ({ config }) => [{ ApplicationId: "a1234567" }],
      }),
      awsResourceTest,
    ])());
  it.skip("SMSTemplate", () =>
    pipe([
      () => ({
        groupType: "Pinpoint::SMSTemplate",
        livesNotFound: ({ config }) => [{ ApplicationId: "a1234567" }],
      }),
      awsResourceTest,
    ])());
});
