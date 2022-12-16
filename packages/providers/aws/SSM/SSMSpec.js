const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { isOurMinion, compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { SSMDocument } = require("./SSMDocument");
const { SSMParameter } = require("./SSMParameter");
const { SSMServiceSetting } = require("./SSMServiceSetting");

const GROUP = "SSM";
const compareSSM = compareAws({});

module.exports = pipe([
  () => [
    //
    SSMDocument({}),
    SSMParameter({}),
    SSMServiceSetting({}),
  ],
  map(createAwsService),
  map(defaultsDeep({ group: GROUP, isOurMinion, compare: compareSSM({}) })),
]);
