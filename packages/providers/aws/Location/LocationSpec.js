const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

// const {
//   LocationGeoFenceCollection,
// } = require("./LocationGeoFenceCollection");
// const {
//   LocationMap,
// } = require("./LocationMap");

//  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html

const GROUP = "Location";
const tagsKey = "Tags";

const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    // LocationGeoFenceCollection({}),
    // LocationMap({}),
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
