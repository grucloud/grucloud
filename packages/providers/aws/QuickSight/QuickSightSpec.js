const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html

const { QuickSightDashboard } = require("./QuickSightDashboard");
const { QuickSightDataSet } = require("./QuickSightDataSet");

const { QuickSightDataSource } = require("./QuickSightDataSource");
const { QuickSightGroup } = require("./QuickSightGroup");
const { QuickSightGroupMembership } = require("./QuickSightGroupMembership");
const { QuickSightTemplate } = require("./QuickSightTemplate");
const { QuickSightTheme } = require("./QuickSightTheme");
const { QuickSightUser } = require("./QuickSightUser");

const GROUP = "QuickSight";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    QuickSightDashboard({}),
    QuickSightDataSet({}),
    QuickSightDataSource({}),
    QuickSightGroup({}),
    QuickSightGroupMembership({}),
    QuickSightTemplate({}),
    QuickSightTheme({}),
    QuickSightUser({}),
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
