const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "Account";

// No tags for Account
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "key" });

const { AccountAlternateAccount } = require("./AccountAlternateAccount");

module.exports = pipe([
  () => [
    {
      type: "AlternateAccount",
      Client: AccountAlternateAccount,
      propertiesDefault: {},
      omitProperties: [],
      inferName: pipe([get("properties.AlternateContactType")]),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
