const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "IdentityStore";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { createAwsService } = require("../AwsService");

const { IdentityStoreUser } = require("./IdentityStoreUser");
const { IdentityStoreGroup } = require("./IdentityStoreGroup");

module.exports = pipe([
  () => [
    //
    IdentityStoreUser({}),
    IdentityStoreGroup({}),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      tagsKey,
    })
  ),
]);
