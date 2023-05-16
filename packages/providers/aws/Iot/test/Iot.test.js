const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

/**
 * 
IotCACertificate
IotCertificate
IotJob
IotOTAUpdate
IotStream
IotThingType
IotThingTypeState
 */

describe("Iot", async function () {
  it("Authorizer", () =>
    pipe([
      () => ({
        groupType: "IoT::Authorizer",
        livesNotFound: ({ config }) => [{ authorizerName: "a123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("BillingGroup", () =>
    pipe([
      () => ({
        groupType: "IoT::BillingGroup",
        livesNotFound: ({ config }) => [{ authorizerName: "a123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("Certificate", () =>
    pipe([
      () => ({
        groupType: "IoT::Certificate",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("CACertificate", () =>
    pipe([
      () => ({
        groupType: "IoT::CACertificate",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("FleetMetric", () =>
    pipe([
      () => ({
        groupType: "IoT::FleetMetric",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("IndexingConfiguration", () =>
    pipe([
      () => ({
        groupType: "IoT::IndexingConfiguration",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("LoggingOptions", () =>
    pipe([
      () => ({
        groupType: "IoT::LoggingOptions",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Policy", () =>
    pipe([
      () => ({
        groupType: "IoT::Policy",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("PolicyAttachment", () =>
    pipe([
      () => ({
        groupType: "IoT::PolicyAttachment",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ProvisioningTemplate", () =>
    pipe([
      () => ({
        groupType: "IoT::ProvisioningTemplate",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());

  it.skip("RoleAlias", () =>
    pipe([
      () => ({
        groupType: "IoT::RoleAlias",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Thing", () =>
    pipe([
      () => ({
        groupType: "IoT::Thing",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ThingGroup", () =>
    pipe([
      () => ({
        groupType: "IoT::ThingGroup",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ThingGroupMembership", () =>
    pipe([
      () => ({
        groupType: "IoT::ThingGroupMembership",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ThingType", () =>
    pipe([
      () => ({
        groupType: "IoT::ThingType",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("TopicRule", () =>
    pipe([
      () => ({
        groupType: "IoT::TopicRule",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("TopicRuleDestination", () =>
    pipe([
      () => ({
        groupType: "IoT::TopicRuleDestination",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  //
});
