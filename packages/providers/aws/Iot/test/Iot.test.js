const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

/**
 * 
IotCACertificate
IotCertificate
IotJob
IotOTAUpdate
IotPolicy
IotRoleAlias
IotStream
IotThing
IotThingGroup
IotThingType
IotThingTypeState
IotTopicRule
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
  it.skip("FleetMetric", () =>
    pipe([
      () => ({
        groupType: "IoT::FleetMetric",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  //
});
