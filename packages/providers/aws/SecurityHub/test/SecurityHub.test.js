const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SecurityHub", async function () {
  it("Account", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::Account",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("ActionTarget", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::ActionTarget",
        livesNotFound: ({ config }) => [
          {
            ActionTargetArn: `arn:aws:securityhub:${
              config.region
            }:${config.accountId()}:action/custom/Remediation`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("FindingAggregator", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::FindingAggregator",
        livesNotFound: ({ config }) => [
          {
            FindingAggregatorArn: `arn:aws:securityhub:${
              config.region
            }:${config.accountId()}:finding-aggregator/123e4567-e89b-12d3-a456-426652340000`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Insight", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::Insight",
        livesNotFound: ({ config }) => [
          {
            InsightArn: `arn:aws:securityhub:${
              config.region
            }:${config.accountId()}:insight/123456789012/custom/a1b2c3d4-5678-90ab-cdef-EXAMPLE11111`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("InviteAcceptor", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::InviteAcceptor",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Member", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::Member",
        livesNotFound: ({ config }) => [{ AccountId: config.accountId() }],
      }),
      awsResourceTest,
    ])());
  it("OrganizationAdminAccount", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::OrganizationAdminAccount",
        livesNotFound: ({ config }) => [{ AdminAccountId: config.accountId() }],
      }),
      awsResourceTest,
    ])());
  it("OrganizationConfiguration", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::OrganizationConfiguration",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ProductSubscription", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::ProductSubscription",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("StandardsControl", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::StandardsControl",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("StandardsSubscription", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::StandardsSubscription",
        livesNotFound: ({ config }) => [
          {
            StandardsSubscriptionArn: `arn:aws:securityhub:${
              config.region
            }:${config.accountId()}:subscription/cis-aws-foundations-benchmark-ko/v/1.2.0`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
