const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("MediaLive", async function () {
  it("Channel", () =>
    pipe([
      () => ({
        groupType: "MediaLive::Channel",
        livesNotFound: ({ config }) => [{ ChannelId: "123" }],
      }),
      awsResourceTest,
    ])());
  it("Input", () =>
    pipe([
      () => ({
        groupType: "MediaLive::Input",
        livesNotFound: ({ config }) => [{ InputId: "123" }],
      }),
      awsResourceTest,
    ])());
  it("InputSecurityGroup", () =>
    pipe([
      () => ({
        groupType: "MediaLive::InputSecurityGroup",
        livesNotFound: ({ config }) => [{ InputSecurityGroupId: "123" }],
      }),
      awsResourceTest,
    ])());
  it("Multiplex", () =>
    pipe([
      () => ({
        groupType: "MediaLive::Multiplex",
        livesNotFound: ({ config }) => [{ MultiplexId: "123" }],
      }),
      awsResourceTest,
    ])());
  it("MultiplexProgram", () =>
    pipe([
      () => ({
        groupType: "MediaLive::MultiplexProgram",
        livesNotFound: ({ config }) => [
          { MultiplexId: "123", ProgramName: "p123" },
        ],
      }),
      awsResourceTest,
    ])());
});
