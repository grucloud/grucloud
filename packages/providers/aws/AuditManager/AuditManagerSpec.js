const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AuditManager.html

//const { AuditManagerAssessment } = require("./AuditManagerAssessment");
//const { AuditManagerAssessmentReport } = require("./AuditManagerAssessmentReport");
//const { AuditManagerControl } = require("./AuditManagerControl");
//const { AuditManagerFramework } = require("./AuditManagerFramework");
//const { AuditManagerFrameworkShare } = require("./AuditManagerFrameworkShare");

const GROUP = "AuditManager";

const compare = compareAws({});

module.exports = pipe([
  () => [
    // AuditManagerAssessment({})
    // AuditManagerAssessmentReport({})
    // AuditManagerControl({})
    // AuditManagerFramework({})
    // AuditManagerFrameworkShare({})
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
