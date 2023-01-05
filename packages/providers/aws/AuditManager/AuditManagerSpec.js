const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html

const {
  AuditManagerAccountRegistration,
} = require("./AuditManagerAccountRegistration");
const { AuditManagerAssessment } = require("./AuditManagerAssessment");
const {
  AuditManagerAssessmentReport,
} = require("./AuditManagerAssessmentReport");
const { AuditManagerControl } = require("./AuditManagerControl");
const {
  AuditManagerAssessmentFramework,
} = require("./AuditManagerAssessmentFramework");
//const { AuditManagerFrameworkShare } = require("./AuditManagerFrameworkShare");

const { AuditManagerSettings } = require("./AuditManagerSettings");

const GROUP = "AuditManager";
const tagsKey = "tags";

const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    AuditManagerAccountRegistration({}),
    AuditManagerAssessment({}),
    AuditManagerAssessmentReport({}),
    AuditManagerControl({}),
    AuditManagerAssessmentFramework({}),
    // AuditManagerFramework({})
    // AuditManagerFrameworkShare({})
    AuditManagerSettings({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
