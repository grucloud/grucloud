const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { isOurMinion, compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { SSMActivation } = require("./SSMActivation");
const { SSMAssociation } = require("./SSMAssociation");
const { SSMDocument } = require("./SSMDocument");
const { SSMMaintenanceWindow } = require("./SSMMaintenanceWindow");
const { SSMMaintenanceWindowTarget } = require("./SSMMaintenanceWindowTarget");
const { SSMMaintenanceWindowTask } = require("./SSMMaintenanceWindowTask");
const { SSMPatchBaseline } = require("./SSMPatchBaseline");
const { SSMParameter } = require("./SSMParameter");
const { SSMServiceSetting } = require("./SSMServiceSetting");

const GROUP = "SSM";
const compareSSM = compareAws({});

module.exports = pipe([
  () => [
    SSMActivation({}),
    SSMAssociation({}),
    SSMDocument({}),
    SSMMaintenanceWindow({}),
    SSMMaintenanceWindowTarget({}),
    SSMMaintenanceWindowTask({}),
    SSMParameter({}),
    SSMPatchBaseline({}),
    SSMServiceSetting({}),
  ],
  map(createAwsService),
  map(defaultsDeep({ group: GROUP, isOurMinion, compare: compareSSM({}) })),
]);
