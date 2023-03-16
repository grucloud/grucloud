const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html

// const { QuickSightDataSource } = require("./QuickSightDataSource");
// const { QuickSightGroupMembership } = require("./QuickSightGroupMembership");
// const { QuickSightUser } = require("./QuickSightUser");
// const { QuickSightView } = require("./QuickSightView");

const GROUP = "QuickSight";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    //
    // QuickSightDataSource({}),
    // QuickSightGroupMembership({}),
    // QuickSightUser({})
    // QuickSightView({})
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
