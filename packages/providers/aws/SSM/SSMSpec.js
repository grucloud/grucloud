const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { isOurMinion, compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { SSMDocument } = require("./SSMDocument");
const { SSMMaintenanceWindow } = require("./SSMMaintenanceWindow");
const { SSMMaintenanceWindowTarget } = require("./SSMMaintenanceWindowTarget");
const { SSMMaintenanceWindowTask } = require("./SSMMaintenanceWindowTask");
const { SSMParameter } = require("./SSMParameter");
const { SSMServiceSetting } = require("./SSMServiceSetting");

const GROUP = "SSM";
const compareSSM = compareAws({});

module.exports = pipe([
  () => [
    SSMDocument({}),
    SSMMaintenanceWindow({}),
    SSMMaintenanceWindowTarget({}),
    SSMMaintenanceWindowTask({}),
    SSMParameter({}),
    SSMServiceSetting({}),
  ],
  map(createAwsService),
  map(defaultsDeep({ group: GROUP, isOurMinion, compare: compareSSM({}) })),
]);
