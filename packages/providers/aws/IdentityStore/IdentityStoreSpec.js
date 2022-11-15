const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "IdentityStore";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { createAwsService } = require("../AwsService");

const {
  IdentityStoreGroupMembership,
} = require("./IdentityStoreGroupMembership");
const { IdentityStoreGroup } = require("./IdentityStoreGroup");
const { IdentityStoreUser } = require("./IdentityStoreUser");

module.exports = pipe([
  () => [
    IdentityStoreGroupMembership({}),
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
