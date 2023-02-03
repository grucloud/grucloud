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
  AuditManagerAssessmentDelegation,
} = require("./AuditManagerAssessmentDelegation");

const {
  AuditManagerAssessmentReport,
} = require("./AuditManagerAssessmentReport");
const { AuditManagerControl } = require("./AuditManagerControl");
const {
  AuditManagerAssessmentFramework,
} = require("./AuditManagerAssessmentFramework");
const {
  AuditManagerAssessmentFrameworkShare,
} = require("./AuditManagerAssessmentFrameworkShare");
const { AuditManagerSettings } = require("./AuditManagerSettings");
const {
  AuditManagerOrganizationAdminAccount,
} = require("./AuditManagerOrganizationAdminAccount");

const GROUP = "AuditManager";
const tagsKey = "tags";

const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    AuditManagerAccountRegistration({}),
    AuditManagerAssessment({}),
    AuditManagerAssessmentDelegation({}),
    AuditManagerAssessmentReport({}),
    AuditManagerControl({}),
    AuditManagerAssessmentFramework({}),
    AuditManagerAssessmentFrameworkShare({}),
    AuditManagerSettings({}),
    AuditManagerOrganizationAdminAccount({}),
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
