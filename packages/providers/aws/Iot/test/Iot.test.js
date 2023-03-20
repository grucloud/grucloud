const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

/**
 * IotAuthorizer
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
  it.skip("Authorizer", () =>
    pipe([
      () => ({
        groupType: "Iot::Authorizer",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
