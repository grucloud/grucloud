const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("MediaLive", async function () {
  it.skip("Channel", () =>
    pipe([
      () => ({
        groupType: "MediaLive::Channel",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Input", () =>
    pipe([
      () => ({
        groupType: "MediaLive::Input",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("InputSecurityGroup", () =>
    pipe([
      () => ({
        groupType: "MediaLive::InputSecurityGroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Multiplex", () =>
    pipe([
      () => ({
        groupType: "MediaLive::Multiplex",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("MultiplexProgram", () =>
    pipe([
      () => ({
        groupType: "MediaLive::MultiplexProgram",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
