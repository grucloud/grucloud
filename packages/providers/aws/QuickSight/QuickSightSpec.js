const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html
const {
  QuickSightAccountSubscription,
} = require("./QuickSightAccountSubscription");
const { QuickSightAnalysis } = require("./QuickSightAnalysis");
const { QuickSightDashboard } = require("./QuickSightDashboard");
const { QuickSightDataSet } = require("./QuickSightDataSet");
const { QuickSightDataSource } = require("./QuickSightDataSource");
const { QuickSightFolder } = require("./QuickSightFolder");
const { QuickSightFolderMembership } = require("./QuickSightFolderMembership");
const {
  QuickSightIAMPolicyAssignment,
} = require("./QuickSightIAMPolicyAssignment");
const { QuickSightIngestion } = require("./QuickSightIngestion");
const { QuickSightGroup } = require("./QuickSightGroup");
const { QuickSightGroupMembership } = require("./QuickSightGroupMembership");
const { QuickSightRefreshSchedule } = require("./QuickSightRefreshSchedule");
const { QuickSightTemplate } = require("./QuickSightTemplate");
const { QuickSightTemplateAlias } = require("./QuickSightTemplateAlias");
const { QuickSightTheme } = require("./QuickSightTheme");
//const { QuickSightTopic } = require("./QuickSightTopic");
//const { QuickSightTopicPermission } = require("./QuickSightTopicPermission");

const { QuickSightUser } = require("./QuickSightUser");
const { QuickSightVPCConnection } = require("./QuickSightVPCConnection");

const GROUP = "QuickSight";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

module.exports = pipe([
  () => [
    QuickSightAccountSubscription({}),
    QuickSightAnalysis({}),
    QuickSightDashboard({}),
    QuickSightDataSet({}),
    QuickSightDataSource({}),
    QuickSightFolder({}),
    QuickSightFolderMembership({}),
    QuickSightIAMPolicyAssignment({}),
    QuickSightIngestion({}),
    QuickSightGroup({}),
    QuickSightGroupMembership({}),
    QuickSightRefreshSchedule({}),
    QuickSightTemplate({}),
    QuickSightTemplateAlias({}),
    QuickSightTheme({}),
    //QuickSightTopic({}),
    //QuickSightTopicPermission({}),

    QuickSightUser({}),
    QuickSightVPCConnection({}),
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
