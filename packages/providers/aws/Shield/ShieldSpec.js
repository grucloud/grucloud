const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Shield.html

const { ShieldProtection } = require("./ShieldProtection");
const { ShieldProtectionGroup } = require("./ShieldProtectionGroup");
//const { ShieldProtectionHealthCheckAssociation } = require("./ShieldProtectionHealthCheckAssociation");

const GROUP = "Shield";

const compare = compareAws({});

module.exports = pipe([
  () => [
    ShieldProtection({}),
    ShieldProtectionGroup({}),
    // ShieldProtectionHealthCheckAssociation({})
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
