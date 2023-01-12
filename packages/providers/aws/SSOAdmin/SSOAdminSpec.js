const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "SSOAdmin";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { SSOAdminAccountAssignment } = require("./SSOAdminAccountAssignment");
const { SSOAdminInstance } = require("./SSOAdminInstance");
const {
  SSOAdminInstanceAccessControlAttribute,
} = require("./SSOAdminInstanceAccessControlAttribute");
const { SSOAdminPermissionSet } = require("./SSOAdminPermissionSet");
const { createAwsService } = require("../AwsService");

module.exports = pipe([
  () => [
    SSOAdminAccountAssignment({}),
    SSOAdminInstance({}),
    SSOAdminInstanceAccessControlAttribute({}),
    SSOAdminPermissionSet({}),
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
