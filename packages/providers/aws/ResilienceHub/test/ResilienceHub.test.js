const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ResilienceHub", async function () {
  it("App", () =>
    pipe([
      () => ({
        groupType: "ResilienceHub::App",
        livesNotFound: ({ config }) => [
          {
            appArn: `arn:${config.partition}:resiliencehub:${
              config.region
            }:${config.accountId()}:app/b6e29843-fee3-4b39-84cc-33e51a87dd60`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ResiliencyPolicy", () =>
    pipe([
      () => ({
        groupType: "ResilienceHub::ResiliencyPolicy",
        livesNotFound: ({ config }) => [
          {
            policyArn: `arn:${config.partition}:resiliencehub:${
              config.region
            }:${config.accountId()}:resiliency-policy/b6e29843-fee3-4b39-84cc-33e51a87dd60`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
