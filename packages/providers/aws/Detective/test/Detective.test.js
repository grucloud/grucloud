const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Detective", async function () {
  it("Graph", () =>
    pipe([
      () => ({
        groupType: "Detective::Graph",
        livesNotFound: ({ config }) => [
          {
            GraphArn: `arn:aws:detective:${
              config.region
            }:${config.accountId()}:graph/7ea40abc165723333fb7f3f08c8e6465`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("InvitationAccepter", () =>
    pipe([
      () => ({
        groupType: "Detective::InvitationAccepter",
        livesNotFound: ({ config }) => [
          {
            GraphArn: `arn:aws:detective:${
              config.region
            }:${config.accountId()}:graph:7ea40abc165723333fb7f3f08c8e6465`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Member", () =>
    pipe([
      () => ({
        groupType: "Detective::Member",
        livesNotFound: ({ config }) => [
          {
            GraphArn: `arn:aws:detective:${
              config.region
            }:${config.accountId()}:graph/7ea40abc165723333fb7f3f08c8e6465`,
            AccountId: "1234567890",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("OrganizationAdminAccount", () =>
    pipe([
      () => ({
        groupType: "Detective::OrganizationAdminAccount",
        livesNotFound: ({ config }) => [
          {
            GraphArn: `arn:aws:detective:${
              config.region
            }:${config.accountId()}:graph/7ea40abc165723333fb7f3f08c8e6465`,
            AccountId: "1234567890",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("OrganizationConfiguration", () =>
    pipe([
      () => ({
        groupType: "Detective::OrganizationConfiguration",
        livesNotFound: ({ config }) => [
          {
            GraphArn: `arn:aws:detective:${
              config.region
            }:${config.accountId()}:graph/7ea40abc165723333fb7f3f08c8e6465`,
          },
        ],
        skipDelete: true,
      }),
      awsResourceTest,
    ])());
});
