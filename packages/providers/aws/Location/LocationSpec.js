const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { LocationGeofenceCollection } = require("./LocationGeofenceCollection");
const { LocationMap } = require("./LocationMap");
const { LocationPlaceIndex } = require("./LocationPlaceIndex");
const { LocationRouteCalculator } = require("./LocationRouteCalculator");
const { LocationTracker } = require("./LocationTracker");
const { LocationTrackerAssociation } = require("./LocationTrackerAssociation");

//  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Location.html

const GROUP = "Location";
const tagsKey = "Tags";

const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    //
    LocationGeofenceCollection({}),
    LocationMap({}),
    LocationPlaceIndex({}),
    LocationRouteCalculator({}),
    LocationTracker({}),
    LocationTrackerAssociation({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
