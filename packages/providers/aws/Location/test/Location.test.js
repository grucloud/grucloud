const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Location", async function () {
  it("GeoFenceCollection", () =>
    pipe([
      () => ({
        groupType: "Location::GeofenceCollection",
        livesNotFound: ({ config }) => [
          {
            CollectionName: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Map", () =>
    pipe([
      () => ({
        groupType: "Location::Map",
        livesNotFound: ({ config }) => [
          {
            MapName: "m-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("PlaceIndex", () =>
    pipe([
      () => ({
        groupType: "Location::PlaceIndex",
        livesNotFound: ({ config }) => [{ IndexName: "a123" }],
      }),
      awsResourceTest,
    ])());
  it("RouteCalculator", () =>
    pipe([
      () => ({
        groupType: "Location::RouteCalculator",
        livesNotFound: ({ config }) => [{ CalculatorName: "c123" }],
      }),
      awsResourceTest,
    ])());
  it("Tracker", () =>
    pipe([
      () => ({
        groupType: "Location::Tracker",
        livesNotFound: ({ config }) => [{ TrackerName: "t123" }],
      }),
      awsResourceTest,
    ])());
  it("TrackerAssociation", () =>
    pipe([
      () => ({
        groupType: "Location::TrackerAssociation",
        livesNotFound: ({ config }) => [
          {
            ConsumerArn: `arn:${
              config.partition
            }:geo::${config.accountId()}:geofence-collection:geo-a6c366c3b3db7df6de6aaec566d10a54`,
            TrackerName: "t123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
