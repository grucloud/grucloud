const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SESV2", async function () {
  it("ConfigurationSet", () =>
    pipe([
      () => ({
        groupType: "SESV2::ConfigurationSet",
        livesNotFound: ({ config }) => [
          {
            ConfigurationSetName: `c123`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ConfigurationSetEventDestination", () =>
    pipe([
      () => ({
        groupType: "SESV2::ConfigurationSetEventDestination",
        livesNotFound: ({ config }) => [
          {
            ConfigurationSetName: `c123`,
            EventDestinationName: "e1234",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ContactList", () =>
    pipe([
      () => ({
        groupType: "SESV2::ContactList",
        livesNotFound: ({ config }) => [
          {
            ContactListName: "cl123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("DedicatedIp", () =>
    pipe([
      () => ({
        groupType: "SESV2::DedicatedIp",
        livesNotFound: ({ config }) => [
          {
            Ip: "1.2.3.4",
          },
        ],
        skipDelete: true,
      }),
      awsResourceTest,
    ])());
  it("DedicatedIpPool", () =>
    pipe([
      () => ({
        groupType: "SESV2::DedicatedIpPool",
        livesNotFound: ({ config }) => [
          {
            PoolName: `p123`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("EmailIdentity", () =>
    pipe([
      () => ({
        groupType: "SESV2::EmailIdentity",
        livesNotFound: ({ config }) => [
          {
            EmailIdentity: `pipo`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("EmailTemplate", () =>
    pipe([
      () => ({
        groupType: "SESV2::EmailTemplate",
        livesNotFound: ({ config }) => [
          {
            TemplateName: "t123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
