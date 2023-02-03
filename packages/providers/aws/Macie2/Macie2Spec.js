const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Macie2.html

const { Macie2Account } = require("./Macie2Account");
//const { Macie2ClassificationExportConfiguration } = require("./Macie2ClassificationExportConfiguration");
const { Macie2ClassificationJob } = require("./Macie2ClassificationJob");
const { Macie2CustomDataIdentifier } = require("./Macie2CustomDataIdentifier");
//const { Macie2FindingsFilter } = require("./Macie2FindingsFilter");
//const { Macie2InvitationAccepter } = require("./Macie2InvitationAccepter");
const { Macie2Member } = require("./Macie2Member");
const {
  Macie2OrganizationAdminAccount,
} = require("./Macie2OrganizationAdminAccount");

const GROUP = "Macie2";

const compare = compareAws({});

module.exports = pipe([
  () => [
    Macie2Account({}),
    // Macie2LicenseAssociation({})
    // Macie2ClassificationExportConfiguration({})
    Macie2ClassificationJob({}),
    Macie2CustomDataIdentifier({}),
    // Macie2FindingsFilter({})
    // Macie2InvitationAccepter({})
    Macie2Member({}),
    Macie2OrganizationAdminAccount({}),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
