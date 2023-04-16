const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("VpcLattice", async function () {
  it("AccessLogSubscription", () =>
    pipe([
      () => ({
        groupType: "VpcLattice::AccessLogSubscription",
        livesNotFound: ({ config }) => [
          {
            accessLogSubscriptionIdentifier: "als-12345678901234567",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("VpcLatticeAuthPolicy", () =>
    pipe([
      () => ({
        groupType: "VpcLattice::AuthPolicy",
        livesNotFound: ({ config }) => [
          {
            resourceIdentifier: "svc-12345678901234567",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Listener", () =>
    pipe([
      () => ({
        groupType: "VpcLattice::Listener",
        livesNotFound: ({ config }) => [
          {
            serviceIdentifier: "svc-12345678901234567",
            listenerIdentifier: "listener-12345678901234567",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("VpcLatticeResourcePolicy", () =>
    pipe([
      () => ({
        groupType: "VpcLattice::ResourcePolicy",
        livesNotFound: ({ config }) => [
          {
            resourceArn: `arn:aws:vpc:${
              config.region
            }:${config.accountId()}:svc-12345678901234567`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Rule", () =>
    pipe([
      () => ({
        groupType: "VpcLattice::Rule",
        livesNotFound: ({ config }) => [
          {
            ruleIdentifier: "rule-12345678901234567",
            serviceIdentifier: "svc-12345678901234567",
            listenerIdentifier: "listener-12345678901234567",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Service", () =>
    pipe([
      () => ({
        groupType: "VpcLattice::Service",
        livesNotFound: ({ config }) => [
          { serviceIdentifier: "svc-12345678901234567" },
        ],
      }),
      awsResourceTest,
    ])());
  it("ServiceNetwork", () =>
    pipe([
      () => ({
        groupType: "VpcLattice::ServiceNetwork",
        livesNotFound: ({ config }) => [
          { serviceNetworkIdentifier: "sn-12345678901234567" },
        ],
      }),
      awsResourceTest,
    ])());
  it("ServiceNetworkServiceAssociation", () =>
    pipe([
      () => ({
        groupType: "VpcLattice::ServiceNetworkServiceAssociation",
        livesNotFound: ({ config }) => [
          {
            serviceNetworkServiceAssociationIdentifier:
              "snsa-12345678901234567",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ServiceNetworkVpcAssociation", () =>
    pipe([
      () => ({
        groupType: "VpcLattice::ServiceNetworkVpcAssociation",
        livesNotFound: ({ config }) => [
          {
            serviceNetworkVpcAssociationIdentifier: "snva-12345678901234567",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("TargetGroup", () =>
    pipe([
      () => ({
        groupType: "VpcLattice::TargetGroup",
        livesNotFound: ({ config }) => [
          { targetGroupIdentifier: "tg-12345678901234567" },
        ],
      }),
      awsResourceTest,
    ])());
});
