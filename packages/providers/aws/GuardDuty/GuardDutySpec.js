const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/GuardDuty.html

//const { GuardDutyDetector } = require("./GuardDutyDetector");
//const { GuardDutyFilter } = require("./GuardDutyFilter");
//const { GuardDutyInviteAccepter } = require("./GuardDutyInviteAccepter");
//const { GuardDutyIpSet } = require("./GuardDutyIpSet");
//const { GuardDutyMember } = require("./GuardDutyMember");
//const { GuardDutyOrganizationAdminAccount } = require("./GuardDutyOrganizationAdminAccount");
//const { GuardDutyOrganizationConfiguration } = require("./GuardDutyOrganizationConfiguration");
//const { GuardDutyPublishingDestination } = require("./GuardDutyPublishingDestination");
//const { GuardDutyThreatIntelSet } = require("./GuardDutyThreatIntelSet");

const GROUP = "GuardDuty";

const compare = compareAws({});

module.exports = pipe([
  () => [
    // GuardDutyDetector({})
    // GuardDutyFilter({})
    // GuardDutyInviteAccepter({})
    // GuardDutyIpSet({})
    // GuardDutyMember({})
    // GuardDutyOrganizationAdminAccount({})
    // GuardDutyOrganizationConfiguration({})
    // GuardDutyPublishingDestination({})
    // GuardDutyThreatIntelSet({})
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
