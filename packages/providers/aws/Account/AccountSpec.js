const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "Account";

// No tags for Account
const compare = compareAws({});

const { AccountAlternateAccount } = require("./AccountAlternateAccount");
//const { AccountContactInformation } = require("./AccountContactInformation");

module.exports = pipe([
  () => [
    //
    AccountAlternateAccount({}),
    //AccountContactInformation({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
