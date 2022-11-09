const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SecurityHub", async function () {
  it.skip("Account", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::Account",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ActionTarget", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::ActionTarget",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("FindingAggregator", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::FindingAggregator",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Insight", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::Insight",
        livesNotFound: ({ config }) => [{}],
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
  it.skip("Member", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::Member",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("OrganisationAdminAccount", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::OrganisationAdminAccount",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("OrganisationConfiguration", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::OrganisationConfiguration",
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
  it.skip("StandardsSubscription", () =>
    pipe([
      () => ({
        groupType: "SecurityHub::StandardsSubscription",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
