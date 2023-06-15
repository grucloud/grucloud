const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SSMContacts", async function () {
  it("Contact", () =>
    pipe([
      () => ({
        groupType: "SSMContacts::Contact",
        livesNotFound: ({ config }) => [
          {
            ContactId: `arn:${config.partition}:ssm-contacts:${
              config.region
            }:${config.accountId()}:contacts/q1234`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ContactChannel", () =>
    pipe([
      () => ({
        groupType: "SSMContacts::ContactChannel",
        livesNotFound: ({ config }) => [
          {
            ContactChannelArn: `arn:${config.partition}:ssm-contacts:${
              config.region
            }:${config.accountId()}:c/dd`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Plan", () =>
    pipe([
      () => ({
        groupType: "SSMContacts::Plan",
        livesNotFound: ({ config }) => [
          {
            ContactId: `arn:${config.partition}:ssm-contacts:${
              config.region
            }:${config.accountId()}:contact/sq1234`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
