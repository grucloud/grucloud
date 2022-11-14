const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const GROUP = "SSOAdmin";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { SSOAdminInstance } = require("./SSOAdminInstance");
const { SSOAdminPermissionSet } = require("./SSOAdminPermissionSet");

const { createAwsService } = require("../AwsService");

module.exports = pipe([
  () => [
    //
    SSOAdminInstance({}),
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
