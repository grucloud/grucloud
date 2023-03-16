const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Location", async function () {
  it.skip("GeoFenceCollection", () =>
    pipe([
      () => ({
        groupType: "Location::GeoFenceCollection",
        livesNotFound: ({ config }) => [
          {
            //StreamName: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Map", () =>
    pipe([
      () => ({
        groupType: "Location::Map",
        livesNotFound: ({ config }) => [
          {
            //StreamName: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("PlaceIndex", () =>
    pipe([
      () => ({
        groupType: "Location::PlaceIndex",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("RouteCalculator", () =>
    pipe([
      () => ({
        groupType: "Location::RouteCalculator",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Tracker", () =>
    pipe([
      () => ({
        groupType: "Location::Tracker",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("TrackerAssociation", () =>
    pipe([
      () => ({
        groupType: "Location::TrackerAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
