const assert = require("assert");
const { assign, map, pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, callProp, pluck } = require("rubico/x");
const { isOurMinion, compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

const { SSMDocument } = require("./SSMDocument");
const { SSMParameter } = require("./SSMParameter");

const GROUP = "SSM";
const compareSSM = compareAws({});

module.exports = pipe([
  () => [
    //
    SSMDocument({}),
    SSMParameter({}),
  ],
  map(createAwsService),
  map(defaultsDeep({ group: GROUP, isOurMinion, compare: compareSSM({}) })),
]);
